// Obtiene los nombres de roles del usuario para un local específico (o todos si no se especifica)
export function getUserRoles(user, localId = null) {
  if (!user?.usuarioRolesLocales) return []
  return user.usuarioRolesLocales
    .filter(url => !localId || url.localId === localId)
    .map(url => url.rol?.nombre)
    .filter(Boolean)
}

// Obtiene los permisos del usuario para un local específico (o todos si no se especifica)
export function getUserPermissions(user, localId = null) {
  if (!user?.usuarioRolesLocales) return []
  // Busca los rolesLocales asociados al usuario para el local dado
  const rolesLocales = user.usuarioRolesLocales
    .filter(url => !localId || url.localId === localId)
    .map(url => url.rol)
    .filter(Boolean)
  // Extrae los permisos de cada rol
  return rolesLocales.flatMap(rol =>
    rol.permisos?.map(permiso => permiso.nombre) || []
  )
}

// Obtiene las categorías del usuario para cada local
export function getUserCategories(user, localId = null) {
  if (!user?.localUsuarioCategorias) return []
  return user.localUsuarioCategorias
    .filter(luc => !localId || luc.localId === localId)
    .map(luc => luc.categoria?.nombre)
    .filter(Boolean)
}

export function hasRole(user, roleName, localId = null) {
  return getUserRoles(user, localId).includes(roleName)
}

export function hasAnyRole(user, roleNames, localId = null) {
  return getUserRoles(user, localId).some(role => roleNames.includes(role))
}

export function hasPermission(user, permissionName, localId = null) {
  return getUserPermissions(user, localId).includes(permissionName)
}

export function hasAnyPermission(user, permissionNames, localId = null) {
  return getUserPermissions(user, localId).some(perm => permissionNames.includes(perm))
}

export function hasCategory(user, categoryName, localId = null) {
  return getUserCategories(user, localId).includes(categoryName)
}

export function hasAnyCategory(user, categoryNames, localId = null) {
  return getUserCategories(user, localId).some(cat => categoryNames.includes(cat))
}