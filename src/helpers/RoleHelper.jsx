export const getMenuByRole = (roleId) => {
    const role = Number(roleId);
    switch (role) {
        case 65: 
            return ['Dashboard', 'Organization', 'Brand', 'User', 'Campaign', 'BA'];
        case 66: 
        case 80:
            return ['Dashboard', 'Campaign', 'BA'];
        case 61:
        case 82:
            return ['Dashboard', 'Campaign'];
        default:
            return [];
    }
};
