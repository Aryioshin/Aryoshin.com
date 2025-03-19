// File: pages/_app.js
import '../styles/globals.css'; // Mantieni questa riga se già presente
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Funzione per verificare se l'audio è stato caricato
    const checkAudioLoaded = () => {
      if (audioRef.current && audioRef.current.readyState >= 2) {
        console.log('Audio caricato correttamente');
      } else {
        console.log('Audio non caricato correttamente');
      }
    };

    // Aggiungi listener per errori di caricamento dell'audio
    const handleAudioError = (error) => {
      console.error('Errore caricamento audio:', error);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('loadeddata', checkAudioLoaded);
      audioRef.current.addEventListener('error', handleAudioError);
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadeddata', checkAudioLoaded);
        audioRef.current.removeEventListener('error', handleAudioError);
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        // Tenta di riprodurre l'audio
        audioRef.current.volume = 0.3; // Volume al 30%
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            console.log('Audio avviato con successo');
          })
          .catch(err => {
            console.error('Errore nella riproduzione:', err);
            // Molti browser richiedono un'interazione utente per riprodurre audio
            alert('Per ascoltare la musica di sottofondo, clicca di nuovo sull\'icona play');
          });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('Audio in pausa');
      }
    } else {
      console.error('Elemento audio non trovato');
    }
  };

  return (
    <>
      <Head>
        {/* Puoi aggiungere qualsiasi meta tag o script qui */}
      </Head>
      
      {/* Componente principale */}
      <div style={{ position: 'relative' }}>
        <Component {...pageProps} />
        
        {/* Icona Play vicino al titolo (posizionamento da adattare) */}
        <div 
          onClick={toggleAudio}
          style={{
            position: 'absolute',
            top: '20px',  // Adatta in base alla posizione del titolo
            left: '50%',  // Centrato orizzontalmente rispetto alla pagina
            transform: 'translateX(-50%) rotate(-15deg)', // Centrato e inclinato di 15 gradi
            cursor: 'pointer',
            zIndex: 100
          }}
        >
          <img 
            src={isPlaying ? "/images/pause-icon.png" : "/images/play-icon.png"} 
            alt={isPlaying ? "Pausa" : "Play"} 
            width="64" 
            height="64"
            style={{ 
              filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      </div>
      
      {/* Audio di sottofondo */}
      <audio 
        ref={audioRef}
        loop
        src="/images/media/theme-song.mp3" // Percorso all'audio (sostituisci con il nome corretto del file)
      />
    </>
  );
}

export default MyApp;