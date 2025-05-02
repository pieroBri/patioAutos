export const modificarFormatoHora = (hora: string): string => {
    const partes = hora.split(' ');
    
    return partes[partes.length - 1];
}


export const validarFormatoHora = (hora: string): boolean => {
    const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return regex.test(hora);
}

export const validarFormatoPatente = (patente: string): boolean => {
    const regex = /[BC-DF-GH-JK-LP-RS-TV-WX-YZ]{4}[0-9]{2}$/i;
    return regex.test(patente);
}