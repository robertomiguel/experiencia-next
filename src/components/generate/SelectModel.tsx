import { Select } from '../common/Select';

const MODEL_LIST = [
    { value: 1, label: "Viento antiguo" },
    { value: 2, label: "Realidad absoluta 1" },
    { value: 3, label: "Realidad absoluta 2" },
    { value: 4, label: "¿Soy real?" },
    { value: 5, label: "Difusión analógica" },
    { value: 6, label: "Cualquier cosa 1" },
    { value: 7, label: "Cualquier cosa 2" },
    { value: 8, label: "Cualquier cosa 3" },
    { value: 9, label: "AOM mezcla naranja" },
    { value: 10, label: "Conducción ardiente" },
    { value: 11, label: "Romper dominio 1" },
    { value: 12, label: "Romper dominio 2" },
    { value: 13, label: "Mezcla de Cetus Versión" },
    { value: 14, label: "Cuentos infantiles 1" },
    { value: 15, label: "Cuentos infantiles 2 Semirreal" },
    { value: 16, label: "Cuentos infantiles 3 ToonAnime" },
    { value: 17, label: "Falsificación" },
    { value: 18, label: "Mezcla Linda Yuki Adorable medio capítulo 3" },
    { value: 19, label: "Ciberrealismo" },
    { value: 20, label: "Dalcefo" },
    { value: 21, label: "Deliberado 1" },
    { value: 22, label: "Deliberado 2" },
    { value: 23, label: "Anime de ensueño" },
    { value: 24, label: "Difusión onírica 1" },
    { value: 25, label: "Fotoreal onírico 2" },
    { value: 26, label: "Moldeador de Sueños 1 VAE Cocido" },
    { value: 27, label: "Moldeador de Sueños 2" },
    { value: 28, label: "Moldeador de Sueños 3" },
    { value: 29, label: "Borde del realismo Eor" },
    { value: 30, label: "Difusión anime de Eimis" },
    { value: 31, label: "Mezcla vívida de elldreth" },
    { value: 32, label: "Epico fotogasmico XP++" },
    { value: 33, label: "Realismo épico Natural" },
    { value: 34, label: "Realismo épico Evolución pura" },
    { value: 35, label: "No puedo creer que no sea fotografía Seco" },
    { value: 36, label: "Mezcla peluda de indigo Híbrido" },
    { value: 37, label: "Juggernaut Después del desastre" },
    { value: 38, label: "Lofi" },
    { value: 39, label: "Lyriel" },
    { value: 40, label: "Mezcla mágica realista" },
    { value: 41, label: "Mezcla de Mecha" },
    { value: 42, label: "Meinamix Meina 1" },
    { value: 43, label: "Meinamix Meina 2" },
    { value: 44, label: "Sueño interminable" },
    { value: 45, label: "Viaje abierto" },
    { value: 46, label: "Mezcla de pastel anime estilizada podada" },
    { value: 47, label: "Retrato plus" },
    { value: 48, label: "Protogen" },
    { value: 49, label: "Visión realista 1" },
    { value: 50, label: "Visión realista 2" },
    { value: 51, label: "Visión realista 3" },
    { value: 52, label: "Visión realista 4" },
    { value: 53, label: "Visión realista 5" },
    { value: 54, label: "Difusión de cambio de color" },
    { value: 55, label: "Rev animado" },
    { value: 56, label: "Run Diffusion FX 1" },
    { value: 57, label: "Run Diffusion FX 2" },
    { value: 58, label: "SDV" },
    { value: 59, label: "Ema Solo" },
    { value: 60, label: "El enmascarado" },
    { value: 61, label: "Shonins hermosa" },
    { value: 62, label: "La mezcla de los aliados II" },
    { value: 63, label: "Atemporal" },
    { value: 64, label: "Tú beta" },
];

interface Props {
    onChange: (v: number) => void;
    value?: number;
}

export const SelectModel = ({ onChange, value = 3 }: Props) => {

    return (
        <Select showReset defaultValue={3} onChange={onChange} value={value} options={MODEL_LIST} />
    );
}