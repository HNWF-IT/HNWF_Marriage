export function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
}

// Get the first allowed route for a user based on their role and permissions
export function getFirstAllowedRoute(user) {
  if (!user || !user.role) {
    return '/login';
  }

  // Admin users get dashboard
  if (user.role === 'admin') {
    return '/dashboard';
  }

  // Members get first app they have permission for
  const permissions = user.appPermissions || [];

  if (permissions.includes('marriage')) {
    return '/marriage';
  }

  if (permissions.includes('library')) {
    return '/library';
  }

  // If member has no permissions, redirect to login
  // (This shouldn't happen based on requirements, but just in case)
  return '/login';
}

// Check if user has permission for a specific app
export function hasPermission(user, permission) {
  if (!user || !user.role) {
    return false;
  }

  // Admin has all permissions
  if (user.role === 'admin') {
    return true;
  }

  // Check if member has the specific permission
  const permissions = user.appPermissions || [];
  return permissions.includes(permission);
}

// Check if user is admin
export function isAdmin(user) {
  return user && user.role === 'admin';
}
