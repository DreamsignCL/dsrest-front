export const cleanRut = (rut) => {
    return rut
        .replace(/\./g, '')
        .replace(/-/g, '')
        .trim()
}

export const formatRut = (rut) => {
    const cleaned = cleanRut(rut)
    
    if (cleaned.length <= 1) return cleaned
    
    const body = cleaned.slice(0, -1)
    
    const dv = cleaned.slice(-1)
    
    return `${body}-${dv}`
}

export const validateRut = (rut) => {
    const cleaned = cleanRut(rut)

    if (!/^[0-9]+[0-9kK]{1}$/.test(cleaned)) {
        return false
    }

    const body = cleaned.slice(0, -1)

    let dv = cleaned.slice(-1).toUpperCase()

    let sum = 0
    let multiplier = 2

    for (let i = body.length - 1; i >= 0; i--) {
        sum += multiplier * parseInt(body[i])

        multiplier = multiplier < 7
            ? multiplier + 1
            : 2
    }

    const expectedDv = 11 - (sum % 11)

    let calculatedDv = ''

    if (expectedDv === 11) {
        calculatedDv = '0'
    } else if (expectedDv === 10) {
        calculatedDv = 'K'
    } else {
        calculatedDv = String(expectedDv)
    }

    return calculatedDv === dv
}