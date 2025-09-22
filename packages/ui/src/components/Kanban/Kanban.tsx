import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar, User, Flag } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color?: string;
  cards: KanbanCard[];
  limit?: number;
}

export interface KanbanProps {
  columns: KanbanColumn[];
  onCardMove?: (cardId: string, fromStatus: string, toStatus: string) => void;
  onCardClick?: (card: KanbanCard) => void;
  onCardAdd?: (status: string) => void;
  onCardEdit?: (card: KanbanCard) => void;
  onCardDelete?: (cardId: string) => void;
  className?: string;
  cardClassName?: string;
  columnClassName?: string;
  showAddButton?: boolean;
  showCardCount?: boolean;
  draggable?: boolean;
}

export function Kanban({
  columns,
  onCardMove,
  onCardClick,
  onCardAdd,
  onCardEdit,
  onCardDelete,
  className,
  cardClassName,
  columnClassName,
  showAddButton = true,
  showCardCount = true,
  draggable = true
}: KanbanProps) {
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, card: KanbanCard) => {
    if (!draggable) return;
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    if (!draggable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumn: KanbanColumn) => {
    if (!draggable || !draggedCard) return;
    
    e.preventDefault();
    
    if (draggedCard.status !== targetColumn.status) {
      onCardMove?.(draggedCard.id, draggedCard.status, targetColumn.status);
    }
    
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <Flag className="h-3 w-3" />;
      case 'high':
        return <Flag className="h-3 w-3" />;
      case 'medium':
        return <Flag className="h-3 w-3" />;
      case 'low':
        return <Flag className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className={clsx('flex space-x-6 overflow-x-auto pb-4', className)}>
      {columns.map((column) => (
        <div
          key={column.id}
          className={clsx(
            'flex-shrink-0 w-80',
            columnClassName
          )}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div
                className={clsx(
                  'w-3 h-3 rounded-full',
                  column.color || 'bg-gray-400'
                )}
              />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              {showCardCount && (
                <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                  {column.cards.length}
                  {column.limit && `/${column.limit}`}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {showAddButton && onCardAdd && (
                <button
                  onClick={() => onCardAdd(column.status)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Column Cards */}
          <div
            className={clsx(
              'space-y-3 min-h-96 p-2 rounded-lg transition-colors',
              dragOverColumn === column.id && 'bg-primary-50 border-2 border-primary-200 border-dashed'
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column)}
          >
            {column.cards.map((card) => (
              <div
                key={card.id}
                className={clsx(
                  'bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
                  cardClassName
                )}
                draggable={draggable}
                onDragStart={(e) => handleDragStart(e, card)}
                onClick={() => onCardClick?.(card)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {card.title}
                  </h4>
                  {card.priority && (
                    <span
                      className={clsx(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                        getPriorityColor(card.priority)
                      )}
                    >
                      {getPriorityIcon(card.priority)}
                      <span className="ml-1 capitalize">{card.priority}</span>
                    </span>
                  )}
                </div>

                {/* Card Description */}
                {card.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {card.description}
                  </p>
                )}

                {/* Card Tags */}
                {card.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {card.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {card.assignee && (
                      <div className="flex items-center space-x-1">
                        {card.assignee.avatar ? (
                          <img
                            src={card.assignee.avatar}
                            alt={card.assignee.name}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-3 w-3 text-gray-600" />
                          </div>
                        )}
                        <span className="text-xs text-gray-600">
                          {card.assignee.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {card.dueDate && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{format(card.dueDate, 'MMM d')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {column.cards.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No cards in this column</p>
                {showAddButton && onCardAdd && (
                  <button
                    onClick={() => onCardAdd(column.status)}
                    className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Add a card
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook for managing kanban state
export function useKanban(initialColumns: KanbanColumn[]) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

  const moveCard = (cardId: string, fromStatus: string, toStatus: string) => {
    setColumns(prev => {
      const newColumns = [...prev];
      
      // Find source and target columns
      const sourceColumn = newColumns.find(col => col.status === fromStatus);
      const targetColumn = newColumns.find(col => col.status === toStatus);
      
      if (!sourceColumn || !targetColumn) return prev;
      
      // Find and remove card from source column
      const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return prev;
      
      const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
      
      // Update card status and add to target column
      movedCard.status = toStatus;
      targetColumn.cards.push(movedCard);
      
      return newColumns;
    });
  };

  const addCard = (card: KanbanCard) => {
    setColumns(prev => {
      const newColumns = [...prev];
      const targetColumn = newColumns.find(col => col.status === card.status);
      
      if (targetColumn) {
        targetColumn.cards.push(card);
      }
      
      return newColumns;
    });
  };

  const updateCard = (cardId: string, updates: Partial<KanbanCard>) => {
    setColumns(prev => {
      const newColumns = [...prev];
      
      newColumns.forEach(column => {
        const cardIndex = column.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          column.cards[cardIndex] = { ...column.cards[cardIndex], ...updates };
        }
      });
      
      return newColumns;
    });
  };

  const deleteCard = (cardId: string) => {
    setColumns(prev => {
      const newColumns = [...prev];
      
      newColumns.forEach(column => {
        column.cards = column.cards.filter(card => card.id !== cardId);
      });
      
      return newColumns;
    });
  };

  const getCard = (cardId: string): KanbanCard | undefined => {
    for (const column of columns) {
      const card = column.cards.find(card => card.id === cardId);
      if (card) return card;
    }
    return undefined;
  };

  return {
    columns,
    moveCard,
    addCard,
    updateCard,
    deleteCard,
    getCard
  };
}
