// Global Next Unified Portal - Main JavaScript
// Common functionality across all modules

document.addEventListener('DOMContentLoaded', function() {
    // Initialize common components
    initializeSearch();
    initializeNotifications();
    initializeUserMenu();
    initializeResponsiveNavigation();
});

// Search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Implement search logic based on current page
            performSearch(query);
        });
    });
}

function performSearch(query) {
    // This would be implemented based on the current module
    console.log('Searching for:', query);
}

// Notification system
function initializeNotifications() {
    const notificationBell = document.querySelector('.fa-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotificationPanel();
        });
    }
}

function showNotificationPanel() {
    // Create notification dropdown
    const notificationPanel = document.createElement('div');
    notificationPanel.className = 'absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50';
    notificationPanel.innerHTML = `
        <div class="p-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-900">Notifications</h3>
        </div>
        <div class="p-4">
            <div class="space-y-3">
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-exclamation text-red-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">Trade License Expiring</p>
                        <p class="text-xs text-gray-600">Emirates Food Industries LLC</p>
                        <p class="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-check text-green-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">Container Cleared</p>
                        <p class="text-xs text-gray-600">MSCU7834567 at Jebel Ali</p>
                        <p class="text-xs text-gray-500 mt-1">4 hours ago</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Position and show notification panel
    const header = document.getElementById('header');
    header.appendChild(notificationPanel);
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!notificationPanel.contains(e.target) && !e.target.closest('.fa-bell')) {
            notificationPanel.remove();
        }
    });
}

// User menu functionality
function initializeUserMenu() {
    const userMenu = document.querySelector('.fa-chevron-down');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            showUserMenu();
        });
    }
}

function showUserMenu() {
    const userMenuPanel = document.createElement('div');
    userMenuPanel.className = 'absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50';
    userMenuPanel.innerHTML = `
        <div class="py-2">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help</a>
            <hr class="my-2">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</a>
        </div>
    `;
    
    const header = document.getElementById('header');
    header.appendChild(userMenuPanel);
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!userMenuPanel.contains(e.target) && !e.target.closest('.fa-chevron-down')) {
            userMenuPanel.remove();
        }
    });
}

// Responsive navigation
function initializeResponsiveNavigation() {
    // Add mobile menu toggle if needed
    const nav = document.getElementById('main-navigation');
    if (nav && window.innerWidth < 768) {
        // Implement mobile navigation
        createMobileMenu();
    }
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Initialize mobile sidebar if present
    initializeMobileSidebar();
}

function createMobileMenu() {
    // Mobile menu implementation
    console.log('Mobile menu would be implemented here');
}

function handleWindowResize() {
    const width = window.innerWidth;
    
    // Handle sidebar visibility
    const sidebar = document.querySelector('#sidebar');
    const mainContent = document.querySelector('main');
    
    if (width < 768) {
        // Mobile view
        if (sidebar) {
            sidebar.classList.add('transform', '-translate-x-full');
        }
        if (mainContent) {
            mainContent.classList.remove('ml-64');
        }
    } else {
        // Desktop view
        if (sidebar) {
            sidebar.classList.remove('transform', '-translate-x-full');
        }
        if (mainContent) {
            mainContent.classList.add('ml-64');
        }
    }
}

function initializeMobileSidebar() {
    const sidebar = document.querySelector('#sidebar');
    const mainContent = document.querySelector('main');
    
    if (sidebar && mainContent) {
        // Add mobile toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg';
        toggleButton.innerHTML = '<i class="fa-solid fa-bars text-gray-600"></i>';
        toggleButton.onclick = toggleMobileSidebar;
        
        document.body.appendChild(toggleButton);
        
        // Add overlay for mobile
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 hidden';
        overlay.onclick = closeMobileSidebar;
        document.body.appendChild(overlay);
        
        window.mobileSidebarOpen = false;
        window.mobileOverlay = overlay;
    }
}

function toggleMobileSidebar() {
    const sidebar = document.querySelector('#sidebar');
    const overlay = window.mobileOverlay;
    
    if (window.mobileSidebarOpen) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
}

function openMobileSidebar() {
    const sidebar = document.querySelector('#sidebar');
    const overlay = window.mobileOverlay;
    
    if (sidebar && overlay) {
        sidebar.classList.remove('transform', '-translate-x-full');
        overlay.classList.remove('hidden');
        window.mobileSidebarOpen = true;
    }
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('#sidebar');
    const overlay = window.mobileOverlay;
    
    if (sidebar && overlay) {
        sidebar.classList.add('transform', '-translate-x-full');
        overlay.classList.add('hidden');
        window.mobileSidebarOpen = false;
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Status badge colors
const statusColors = {
    'approved': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'rejected': 'bg-red-100 text-red-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-gray-100 text-gray-800',
    'delayed': 'bg-red-100 text-red-800',
    'on-track': 'bg-green-100 text-green-800',
    'at-risk': 'bg-orange-100 text-orange-800'
};

function getStatusBadge(status) {
    const colorClass = statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${status}</span>`;
}

// Table functionality
function initializeTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Add sorting functionality
    const headers = table.querySelectorAll('th[data-sortable]');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            sortTable(table, header);
        });
    });
}

function sortTable(table, header) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const columnIndex = Array.from(header.parentNode.children).indexOf(header);
    const isAscending = header.classList.contains('sort-asc');
    
    // Remove existing sort classes
    header.parentNode.querySelectorAll('th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Add new sort class
    header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
    
    // Sort rows
    rows.sort((a, b) => {
        const aText = a.children[columnIndex].textContent.trim();
        const bText = b.children[columnIndex].textContent.trim();
        
        if (isAscending) {
            return bText.localeCompare(aText);
        } else {
            return aText.localeCompare(bText);
        }
    });
    
    // Reorder rows in DOM
    rows.forEach(row => tbody.appendChild(row));
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-600 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.classList.add('border-red-500');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const errorDiv = field.parentNode.querySelector('.text-red-600');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Loading states
function showLoading(element) {
    element.classList.add('opacity-50', 'pointer-events-none');
    const spinner = document.createElement('div');
    spinner.className = 'absolute inset-0 flex items-center justify-center';
    spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-blue-600"></i>';
    element.style.position = 'relative';
    element.appendChild(spinner);
}

function hideLoading(element) {
    element.classList.remove('opacity-50', 'pointer-events-none');
    const spinner = element.querySelector('.fa-spinner');
    if (spinner) {
        spinner.parentNode.remove();
    }
}

// Export functions for use in other modules
window.GlobalNext = {
    formatCurrency,
    formatDate,
    formatDateTime,
    getStatusBadge,
    validateForm,
    showLoading,
    hideLoading,
    initializeTable,
    toggleMobileSidebar,
    openMobileSidebar,
    closeMobileSidebar,
    handleWindowResize
};
