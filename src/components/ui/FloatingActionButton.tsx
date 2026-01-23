import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FloatingActionButtonProps {
  to?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  title?: string;
}

const FloatingActionButton = ({
  to,
  onClick,
  icon,
  title = 'Add new',
}: FloatingActionButtonProps) => {
  const defaultIcon = <Plus className="h-6 w-6" />;

  const buttonClasses =
    'bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30';

  if (to) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <Link to={to} className={buttonClasses} title={title}>
          {icon || defaultIcon}
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button onClick={onClick} className={buttonClasses} title={title}>
        {icon || defaultIcon}
      </button>
    </div>
  );
};

export default FloatingActionButton;
