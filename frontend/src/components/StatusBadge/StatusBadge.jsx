import PropTypes from 'prop-types';
import { Badge } from '../Badge/Badge';

const statusMap = {
  SCHEDULED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  WAITING: 'warning',
  ACTIVE: 'success',
  INACTIVE: 'default'
};

export const StatusBadge = ({ status }) => {
  const variant = statusMap[status] || 'default';
  return <Badge variant={variant}>{status.replace('_', ' ')}</Badge>;
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};
