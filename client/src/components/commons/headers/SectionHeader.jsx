import React from 'react';

const SectionHeader = ({
  icon,
  title,
  size = 'default', // 'default' or 'small'
  className = '',
  children
}) => {
  const headerClass = size === 'small' ? 'section-header-sm' : 'section-header';

  return (
    <div className={`${headerClass} ${className}`}>
      {icon && icon}
      <span>{title}</span>
      {children}
    </div>
  );
};

export default SectionHeader;
