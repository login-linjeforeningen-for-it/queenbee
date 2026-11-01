export function RoleRenderer({roleId, roles}: {roleId: string, roles: Role[]}): React.ReactElement | null {
    const role = roles?.find(r => r.value === roleId)
    if (!role) {
        return null
    }

    return (
        <span
            style={{
                color: `color-mix(in srgb, ${role.color} 70%, white)`,
                backgroundColor: `${role.color}26`,
                padding: '0.2rem',
                borderRadius: '0.375rem',
                whiteSpace: 'nowrap',
            }}
        >
            @{role.label}
        </span>
    )
}
