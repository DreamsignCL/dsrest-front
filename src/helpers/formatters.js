export const formatCurrency = value => {

    if (
        value === null ||
        value === undefined
    ) {
        return '0'
    }

    return new Intl.NumberFormat(
        'es-CL'
    ).format(Number(value))
}