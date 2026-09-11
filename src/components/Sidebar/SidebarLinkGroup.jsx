import { useEffect, useState } from 'react';

const SidebarLinkGroup = ({ children, activeCondition }) => {
  const [open, setOpen] = useState(!!activeCondition);

  // Auto-open when this section becomes active (never auto-close)
  useEffect(() => {
    if (activeCondition) setOpen(true);
  }, [activeCondition]);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;