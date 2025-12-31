export function RoleRenderer({roleId, roles}: {roleId: string, roles: Role[]}): React.ReactElement | null {
    const role = roles?.find(r => r.value === roleId)
    if (!role) {
        return null
    }

    return (
        <span
            style={{
                color: role.color,
                backgroundColor: `${role.color}26`,
                padding: '0.2rem',
                borderRadius: '0.375rem'
            }}
        >
            @{role.label}
        </span>
    )
}
