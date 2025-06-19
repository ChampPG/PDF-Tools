import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { DragIndicator, Delete } from '@mui/icons-material';

export function SortablePDFItem({ id, name, size, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 8 : 1}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'move',
        '&:hover': {
          elevation: 2
        },
        transition: 'all 0.2s ease'
      }}
    >
      {/* Drag handle area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexGrow: 1,
          cursor: 'move'
        }}
        {...attributes}
        {...listeners}
      >
        <DragIndicator color="action" />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(size)}
          </Typography>
        </Box>
      </Box>

      {/* Remove button */}
      <IconButton
        onClick={onRemove}
        size="small"
        color="error"
        sx={{
          '&:hover': {
            bgcolor: 'error.light'
          }
        }}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Paper>
  );
} 