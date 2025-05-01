export const modificarFormatoHora = (hora: string): string => {
    const partes = hora.split(' ');
    
    return partes[partes.length - 1];
}