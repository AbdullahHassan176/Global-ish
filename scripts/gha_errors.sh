#!/bin/bash
# GitHub Actions Error Summarizer
# Detects failed workflow runs and extracts error information

set -euo pipefail

# Configuration
LIMIT_RUNS=${LIMIT_RUNS:-50}
REPO=${REPO:-}
OUTPUT_DIR="reports"
SUMMARY_MD="$OUTPUT_DIR/summary.md"
SUMMARY_CSV="$OUTPUT_DIR/summary.csv"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo "[INFO] $1" >&2
}

log_warn() {
    echo "[WARN] $1" >&2
}

log_error() {
    echo "[ERROR] $1" >&2
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed. Please install it first."
        exit 1
    fi
    
    # Check if gh is authenticated
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI is not authenticated. Please run 'gh auth login' first."
        exit 1
    fi
    
    log_info "Dependencies check passed"
}

# Get repository information
get_repo_info() {
    if [[ -n "$REPO" ]]; then
        log_info "Using provided repository: $REPO"
        echo "$REPO"
    else
        log_info "Detecting repository from current directory..."
        if ! REPO_INFO=$(gh repo view --json owner,name 2>/dev/null); then
            log_error "Could not detect repository. Please set REPO environment variable or run from a git repository."
            exit 1
        fi
        
        OWNER=$(echo "$REPO_INFO" | jq -r '.owner.login')
        NAME=$(echo "$REPO_INFO" | jq -r '.name')
        REPO="$OWNER/$NAME"
        log_info "Detected repository: $REPO"
        echo "$REPO"
    fi
}

# Get all workflows
get_workflows() {
    local repo="$1"
    log_info "Fetching workflows for $repo..."
    
    if ! gh api "repos/$repo/actions/workflows" --jq '.workflows[] | {id: .id, name: .name, path: .path}' 2>/dev/null | jq -s '.'; then
        log_error "Failed to fetch workflows for $repo"
        exit 1
    fi
}

# Get workflow runs
get_workflow_runs() {
    local repo="$1"
    local workflow_id="$2"
    local workflow_name="$3"
    local limit="$4"
    
    log_info "Fetching runs for workflow: $workflow_name (limit: $limit)"
    
    if ! gh api "repos/$repo/actions/workflows/$workflow_id/runs" \
        --jq ".workflow_runs[] | select(.conclusion != \"success\") | {
            id: .id,
            conclusion: .conclusion,
            created_at: .created_at,
            html_url: .html_url,
            head_sha: .head_sha,
            workflow_name: \"$workflow_name\"
        }" 2>/dev/null | jq -s '.'; then
        log_warn "Failed to fetch runs for workflow $workflow_name"
        echo "[]"
    fi
}

# Get jobs for a run
get_run_jobs() {
    local repo="$1"
    local run_id="$2"
    
    if ! gh api "repos/$repo/actions/runs/$run_id/jobs" --jq '.jobs[] | {
        name: .name,
        conclusion: .conclusion,
        steps: [.steps[] | select(.conclusion == "failure") | {
            name: .name,
            conclusion: .conclusion
        }]
    }' 2>/dev/null | jq -s '.'; then
        log_warn "Failed to fetch jobs for run $run_id"
        echo "[]"
    fi
}

# Extract error lines from logs
extract_errors() {
    local repo="$1"
    local run_id="$2"
    local max_errors=3
    
    log_info "Extracting errors from logs for run $run_id..."
    
    # Download logs
    local temp_logs=$(mktemp)
    if gh api "repos/$repo/actions/runs/$run_id/logs" > "$temp_logs" 2>/dev/null; then
        # Extract error lines (case-insensitive)
        grep -i -E "(::error|error:|failed|exception|traceback)" "$temp_logs" | head -n "$max_errors" | tr '\n' '; ' | sed 's/; $//'
    else
        log_warn "Could not download logs for run $run_id"
        echo "Logs not available"
    fi
    
    rm -f "$temp_logs"
}

# Create output directory
create_output_dir() {
    mkdir -p "$OUTPUT_DIR"
}

# Generate CSV summary
generate_csv() {
    local repo="$1"
    local workflows="$2"
    
    log_info "Generating CSV summary..."
    
    # CSV header
    echo "workflow,run_id,run_url,conclusion,created_at,sha,job_name,failed_steps,error_snippet" > "$SUMMARY_CSV"
    
    # Process each workflow
    echo "$workflows" | jq -r '.[] | "\(.id)|\(.name)"' | while IFS='|' read -r workflow_id workflow_name; do
        log_info "Processing workflow: $workflow_name"
        
        local runs
        runs=$(get_workflow_runs "$repo" "$workflow_id" "$workflow_name" "$LIMIT_RUNS")
        
        if [[ "$runs" == "[]" ]]; then
            log_info "No failed runs found for $workflow_name"
            continue
        fi
        
        echo "$runs" | jq -r '.[] | "\(.id)|\(.conclusion)|\(.created_at)|\(.html_url)|\(.head_sha)"' | while IFS='|' read -r run_id conclusion created_at run_url head_sha; do
            log_info "Processing run: $run_id"
            
            local jobs
            jobs=$(get_run_jobs "$repo" "$run_id")
            
            if [[ "$jobs" == "[]" ]]; then
                # No jobs found, still add to CSV
                echo "$workflow_name,$run_id,$run_url,$conclusion,$created_at,$head_sha,N/A,N/A,N/A" >> "$SUMMARY_CSV"
                continue
            fi
            
            echo "$jobs" | jq -r '.[] | "\(.name)|\(.conclusion)"' | while IFS='|' read -r job_name job_conclusion; do
                if [[ "$job_conclusion" == "failure" ]]; then
                    local error_snippet
                    error_snippet=$(extract_errors "$repo" "$run_id")
                    
                    # Get failed steps for this job
                    local failed_steps
                    failed_steps=$(echo "$jobs" | jq -r ".[] | select(.name == \"$job_name\") | .steps[] | .name" | tr '\n' '; ' | sed 's/; $//')
                    
                    echo "$workflow_name,$run_id,$run_url,$conclusion,$created_at,$head_sha,$job_name,$failed_steps,$error_snippet" >> "$SUMMARY_CSV"
                fi
            done
        done
    done
    
    log_info "CSV summary generated: $SUMMARY_CSV"
}

# Generate Markdown summary
generate_markdown() {
    local repo="$1"
    
    log_info "Generating Markdown summary..."
    
    cat > "$SUMMARY_MD" << EOF
# GitHub Actions Failure Summary

**Repository:** $repo  
**Generated:** $(date -u '+%Y-%m-%d %H:%M:%S UTC')  
**Limit:** $LIMIT_RUNS runs per workflow

## Summary

EOF

    # Count total failures
    local total_failures
    total_failures=$(tail -n +2 "$SUMMARY_CSV" | wc -l)
    
    echo "**Total Failed Runs:** $total_failures" >> "$SUMMARY_MD"
    echo "" >> "$SUMMARY_MD"
    
    if [[ "$total_failures" -eq 0 ]]; then
        echo "🎉 **No failed runs found!** All workflows are passing." >> "$SUMMARY_MD"
    else
        echo "## Failed Runs" >> "$SUMMARY_MD"
        echo "" >> "$SUMMARY_MD"
        echo "| Workflow | Run ID | Status | Created | SHA | Job | Failed Steps | Error Snippet |" >> "$SUMMARY_MD"
        echo "|----------|--------|--------|---------|-----|-----|--------------|---------------|" >> "$SUMMARY_MD"
        
        # Convert CSV to Markdown table
        tail -n +2 "$SUMMARY_CSV" | while IFS=',' read -r workflow run_id run_url conclusion created_at sha job_name failed_steps error_snippet; do
            # Truncate long error snippets
            if [[ ${#error_snippet} -gt 100 ]]; then
                error_snippet="${error_snippet:0:100}..."
            fi
            
            # Escape pipes in content
            error_snippet=$(echo "$error_snippet" | sed 's/|/\\|/g')
            failed_steps=$(echo "$failed_steps" | sed 's/|/\\|/g')
            
            echo "| $workflow | [$run_id]($run_url) | $conclusion | $created_at | \`${sha:0:7}\` | $job_name | $failed_steps | $error_snippet |" >> "$SUMMARY_MD"
        done
    fi
    
    echo "" >> "$SUMMARY_MD"
    echo "---" >> "$SUMMARY_MD"
    echo "*Generated by GitHub Actions Error Summarizer*" >> "$SUMMARY_MD"
    
    log_info "Markdown summary generated: $SUMMARY_MD"
}

# Main function
main() {
    log_info "Starting GitHub Actions Error Summarizer"
    
    # Check dependencies
    check_dependencies
    
    # Get repository info
    local repo
    repo=$(get_repo_info)
    
    # Create output directory
    create_output_dir
    
    # Get all workflows
    local workflows
    workflows=$(get_workflows "$repo")
    
    local workflow_count
    workflow_count=$(echo "$workflows" | jq length)
    log_info "Found $workflow_count workflows"
    
    # Generate summaries
    generate_csv "$repo" "$workflows"
    generate_markdown "$repo"
    
    log_info "Error summarization completed!"
    log_info "Output files:"
    log_info "  - $SUMMARY_MD"
    log_info "  - $SUMMARY_CSV"
    
    # Show summary
    local total_failures
    total_failures=$(tail -n +2 "$SUMMARY_CSV" | wc -l)
    log_info "Total failed runs found: $total_failures"
}

# Run main function
main "$@"
