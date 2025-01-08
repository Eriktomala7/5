export interface Dignidad {
    nombreDignidad: string;
    recinto: string;
    idDignidadProceso: string;
  }
  export interface ActaVoto {
    idCandidato: number;
    votos: number;
    idPartido: string;
    
  }
  
  export interface VotoData {
    idDignidadProceso: string;
    idJunta: string;
    votantes: number;
    votosBlancos: number;
    votosNulos: number;
    digitador: string;
    actaVotos: ActaVoto[];
    
  }