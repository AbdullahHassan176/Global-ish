import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface StepperProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onStepClick?: (step: Step, index: number) => void;
  showConnector?: boolean;
}

export function Stepper({
  steps,
  orientation = 'horizontal',
  size = 'md',
  className,
  onStepClick,
  showConnector = true
}: StepperProps) {
  const sizeClasses = {
    sm: {
      step: 'h-8 w-8 text-xs',
      title: 'text-sm',
      description: 'text-xs',
      connector: 'h-0.5'
    },
    md: {
      step: 'h-10 w-10 text-sm',
      title: 'text-base',
      description: 'text-sm',
      connector: 'h-0.5'
    },
    lg: {
      step: 'h-12 w-12 text-base',
      title: 'text-lg',
      description: 'text-base',
      connector: 'h-1'
    }
  };

  const getStepClasses = (step: Step) => {
    const baseClasses = clsx(
      'flex items-center justify-center rounded-full border-2 font-medium transition-colors',
      sizeClasses[size].step
    );

    switch (step.status) {
      case 'completed':
        return clsx(
          baseClasses,
          'bg-primary-600 border-primary-600 text-white'
        );
      case 'current':
        return clsx(
          baseClasses,
          'bg-primary-50 border-primary-600 text-primary-600'
        );
      case 'error':
        return clsx(
          baseClasses,
          'bg-red-50 border-red-600 text-red-600'
        );
      default:
        return clsx(
          baseClasses,
          'bg-white border-gray-300 text-gray-500',
          step.disabled && 'opacity-50 cursor-not-allowed'
        );
    }
  };

  const getConnectorClasses = (currentStep: Step, nextStep: Step) => {
    const baseClasses = clsx(
      'flex-1 transition-colors',
      sizeClasses[size].connector
    );

    if (currentStep.status === 'completed') {
      return clsx(baseClasses, 'bg-primary-600');
    }

    return clsx(baseClasses, 'bg-gray-300');
  };

  const handleStepClick = (step: Step, index: number) => {
    if (step.disabled || !onStepClick) return;
    onStepClick(step, index);
  };

  if (orientation === 'vertical') {
    return (
      <div className={clsx('space-y-4', className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(step, index)}
                className={getStepClasses(step)}
                disabled={step.disabled}
              >
                {step.status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              {showConnector && index < steps.length - 1 && (
                <div
                  className={clsx(
                    'w-0.5 mt-2 transition-colors',
                    step.status === 'completed' ? 'bg-primary-600' : 'bg-gray-300',
                    sizeClasses[size].connector
                  )}
                  style={{ height: '2rem' }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => handleStepClick(step, index)}
                className={clsx(
                  'text-left',
                  step.disabled && 'cursor-not-allowed'
                )}
                disabled={step.disabled}
              >
                <h3
                  className={clsx(
                    'font-medium transition-colors',
                    sizeClasses[size].title,
                    step.status === 'current' && 'text-primary-600',
                    step.status === 'completed' && 'text-gray-900',
                    step.status === 'error' && 'text-red-600',
                    step.status === 'pending' && 'text-gray-500'
                  )}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p
                    className={clsx(
                      'mt-1 text-gray-500',
                      sizeClasses[size].description
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(step, index)}
                className={getStepClasses(step)}
                disabled={step.disabled}
              >
                {step.status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <div className="mt-2 text-center">
                <h3
                  className={clsx(
                    'font-medium transition-colors',
                    sizeClasses[size].title,
                    step.status === 'current' && 'text-primary-600',
                    step.status === 'completed' && 'text-gray-900',
                    step.status === 'error' && 'text-red-600',
                    step.status === 'pending' && 'text-gray-500'
                  )}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p
                    className={clsx(
                      'mt-1 text-gray-500',
                      sizeClasses[size].description
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {showConnector && index < steps.length - 1 && (
              <div className="flex-1 flex items-center mx-4">
                <div
                  className={getConnectorClasses(step, steps[index + 1])}
                />
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Hook for managing stepper state
export function useStepper(initialSteps: Step[]) {
  const [steps, setSteps] = React.useState<Step[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      // Mark current step as completed
      updateStep(steps[currentStepIndex].id, { status: 'completed' });
      // Move to next step
      setCurrentStepIndex(prev => prev + 1);
      updateStep(steps[currentStepIndex + 1].id, { status: 'current' });
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      // Mark current step as pending
      updateStep(steps[currentStepIndex].id, { status: 'pending' });
      // Move to previous step
      setCurrentStepIndex(prev => prev - 1);
      updateStep(steps[currentStepIndex - 1].id, { status: 'current' });
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      // Reset all steps
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
      // Set target step as current
      setCurrentStepIndex(stepIndex);
      updateStep(steps[stepIndex].id, { status: 'current' });
    }
  };

  const completeStep = (stepId: string) => {
    updateStep(stepId, { status: 'completed' });
  };

  const errorStep = (stepId: string) => {
    updateStep(stepId, { status: 'error' });
  };

  const reset = () => {
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      status: index === 0 ? 'current' as const : 'pending' as const
    })));
    setCurrentStepIndex(0);
  };

  return {
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    updateStep,
    nextStep,
    previousStep,
    goToStep,
    completeStep,
    errorStep,
    reset,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    canGoNext: currentStepIndex < steps.length - 1,
    canGoPrevious: currentStepIndex > 0
  };
}
