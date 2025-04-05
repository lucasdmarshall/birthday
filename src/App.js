import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaClock, FaGift, FaMusic, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Countdown from 'react-countdown';
import { useSpring, animated } from '@react-spring/web';
import { useWindowSize } from 'react-use';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3') center/cover no-repeat;
  padding: 0.5rem;
  color: #fff;
  text-align: center;
  font-family: 'Quicksand', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;

  @media (min-width: 768px) {
    padding: 2rem;
    background-attachment: fixed;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  max-width: 800px;
  width: 95%;
  margin: 1rem auto;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #2c3e50;
  backdrop-filter: blur(10px);
  overflow: hidden;

  h2 {
    font-size: 1.2rem;
    margin: 1rem 0;
  }

  @media (min-width: 768px) {
    width: 90%;
    margin: 2rem auto;
    padding: 3rem;
    border-radius: 20px;

    h2 {
      font-size: 1.5rem;
      margin: 1.5rem 0;
    }
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  
  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
  background: linear-gradient(45deg, #FF6B6B, #e74c3c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  font-family: 'Dancing Script', cursive;
`;

const Button = styled(motion.button)`
  background: transparent;
  border: 2px solid #e74c3c;
  color: #e74c3c;
  padding: 1rem 3rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin: 2rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e74c3c;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
  }
`;

const MapContainer = styled.div`
  height: 250px;
  width: 100%;
  margin: 2rem 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);

  @media (min-width: 768px) {
    height: 300px;
    margin: 3rem 0;
    border-radius: 15px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
    margin: 3rem 0;
    gap: 2rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  svg {
    color: #e74c3c;
    font-size: 1.3rem;
  }
`;

const PhotoBooth = styled(motion.div)`
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(231, 76, 60, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(231, 76, 60, 0.2);
  backdrop-filter: blur(10px);

  h3 {
    font-size: 1.1rem;
  }

  @media (min-width: 768px) {
    margin: 2rem 0;
    padding: 2rem;
    border-radius: 20px;

    h3 {
      font-size: 1.3rem;
    }
  }
`;

const MusicPlayer = styled(motion.div)`
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(231, 76, 60, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(231, 76, 60, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;

  .song-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    max-width: 100%;
    overflow-x: auto;
    padding: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }

  @media (min-width: 768px) {
    margin: 2rem 0;
    padding: 2rem;
    border-radius: 20px;
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;

    .song-list {
      gap: 1rem;
      padding: 0;
    }
  }
`;

const PlaylistItem = styled(motion.button)`
  background: transparent;
  border: 1px solid #e74c3c;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #e74c3c;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
  
  &:hover {
    background: rgba(231, 76, 60, 0.1);
  }
`;

const beachSongs = [
  {
    title: 'Beach Boys - Kokomo',
    url: 'https://www.youtube.com/watch?v=9_5_AD9wXuY'
  },
  {
    title: 'Jack Johnson - Better Together',
    url: 'https://www.youtube.com/watch?v=u57d4_b_YgI'
  },
  {
    title: 'Bob Marley - Three Little Birds',
    url: 'https://www.youtube.com/watch?v=zaGUr6wzyT8'
  },
  {
    title: 'Kenny Chesney - No Shoes, No Shirt, No Problems',
    url: 'https://www.youtube.com/watch?v=HwgI9PBZVlI'
  }
];

function App() {
  const [rsvp, setRsvp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [photos, setPhotos] = useState([]);
  const { width, height } = useWindowSize();
  const birthdayDate = new Date('2025-04-07T12:00:00');
  const restaurantLocation = { lat: 16.8507, lng: 96.1683 };

  const mapStyles = {
    height: "100%",
    width: "100%"
  };

  const mapOptions = {
    styles: [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }, { lightness: 17 }]
      }
    ]
  };

  const springProps = useSpring({
    from: { scale: 1 },
    to: { scale: 1.05 },
    config: { tension: 300, friction: 10 },
    loop: { reverse: true }
  });

  useEffect(() => {
    if (rsvp) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [rsvp]);

  const handleRSVP = () => {
    setRsvp(true);
    const phoneNumber = '+959977123546';
    const message = 'Hey Happy Birthday babe! I am coming🥳';
    
    // Create Viber URL with minimal encoding
    const viberUrl = `viber://chat?number=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    // Try to open Viber
    const openApp = window.open(viberUrl, '_blank');
    
    // If opening the app failed, try the web version
    setTimeout(() => {
      if (!openApp || openApp.closed || openApp.closed === undefined) {
        window.location.href = viberUrl;
      }
    }, 500);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos([...photos, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Beach Birthday Bash! 🎉</Title>
        <h2>Join us in celebrating Lin Latt That Sinn's Birthday!!!</h2>
        
        <InfoSection>
          <InfoItem>
            <FaClock />
            <span>Sunday, April 7th, 2025 • 12:00 PM - 2:00 PM</span>
          </InfoItem>
          <InfoItem>
            <FaMapMarkerAlt />
            <span>Hot Pot Country, South Okkalapa</span>
          </InfoItem>
          <InfoItem>
            <FaGift />
            <span>Your presence is the best gift!</span>
          </InfoItem>
        </InfoSection>

        <MapContainer>
          <LoadScript googleMapsApiKey="AIzaSyDeWpp_TXdI8djM97i-DkAAuASiLC0iuu8">
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={16}
              center={restaurantLocation}
              options={mapOptions}
            >
              <Marker position={restaurantLocation} />
            </GoogleMap>
          </LoadScript>
        </MapContainer>
        <a 
          href="https://maps.app.goo.gl/4cp52bKzrD6YFgbn9" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#e74c3c',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '1rem',
            fontSize: '0.9rem',
            padding: '0.5rem 1rem',
            border: '1px solid #e74c3c',
            borderRadius: '20px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#e74c3c';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#e74c3c';
          }}
        >
          📍 Get Directions
        </a>

        <p>Join us for a celebration with delicious hot pot and wonderful company! Feel the breeze while we celebrate from noon until 2 PM!</p>

        <div style={{ margin: '3rem 0' }}>
          <h3 style={{ marginBottom: '1rem', color: '#e74c3c' }}>Time Until The Celebration</h3>
          <Countdown
            date={birthdayDate}
            renderer={({ days, hours, minutes, seconds }) => (
              <animated.div style={springProps}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c' }}>
                  {days}d {hours}h {minutes}m {seconds}s
                </div>
              </animated.div>
            )}
          />
        </div>

        <MusicPlayer
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FaMusic size={24} style={{ color: '#e74c3c' }} />
          <div className="song-list">
            {beachSongs.map((song, index) => (
              <PlaylistItem
                key={index}
                onClick={() => {
                  if (currentSong?.title === song.title) {
                    // If clicking the current song, open in YouTube
                    window.open(song.url, '_blank');
                  } else {
                    // Otherwise, update the current song
                    setCurrentSong(song);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: currentSong?.title === song.title ? 'rgba(231, 76, 60, 0.1)' : 'transparent'
                }}
              >
                {song.title}
                {currentSong?.title === song.title && ' ▶️'}
              </PlaylistItem>
            ))}
          </div>
        </MusicPlayer>

        <PhotoBooth
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 style={{ marginBottom: '1.5rem', color: '#e74c3c' }}><FaCamera /> Beach Photo Booth</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ marginBottom: '1.5rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
            {photos.map((photo, index) => (
              <motion.img
                key={index}
                src={photo}
                alt="Uploaded photo"
                style={{ height: '100px', maxWidth: '150px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                whileHover={{ scale: 1.05, rotate: '-2deg' }}
              />
            ))}
          </div>
        </PhotoBooth>

        {!rsvp ? (
          <Button
            onClick={handleRSVP}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RSVP Now
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h3>Thanks for RSVPing! 🎊</h3>
            <p>We can't wait to celebrate with you!</p>
          </motion.div>
        )}
      </Card>
    </Container>
  );
}

export default App;
