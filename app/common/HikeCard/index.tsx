import React, { useState } from 'react';
import classnames from 'classnames';
import Container from '@common/Container';
import useToggleDarkMode from '@hooks/useToggleDarkMode';
import useFetchKml from '@hooks/useFetchKml';
import ReactLeafletKml from 'react-leaflet-kml';
import { Adjust, SettingsEthernet, Timer, TrendingUp, TrendingDown } from '@material-ui/icons';
import { Map, TileLayer } from 'react-leaflet';
import styles from './styles.module.scss';

export interface IHikeData {
  name: string;
  distance: string;
  time: string;
  ascent: string;
  descent: string;
  date: Date;
  start: string;
  finish: string;
  country: string;
  description: string;
  fileName: string;
  viewport: { center: string[]; zoom: string };
}
interface IHikeCard {
  hikeData: IHikeData;
}

const HikeCard: React.FC<IHikeCard> = ({
  hikeData: {
    name,
    distance,
    time,
    ascent,
    descent,
    date,
    start,
    finish,
    country,
    fileName,
    description,
    viewport,
  },
}) => {
  const { isDarkMode } = useToggleDarkMode();
  const [originalViewport, setViewport] = useState<object | null>(null);
  const { kml } = useFetchKml(fileName);

  return (
    <Container>
      <div className={classnames(styles.hikeCard, { [styles.darkModeHikeCard]: isDarkMode })}>
        <div className="row">
          <div className={`col-xs-12 ${styles.heading}`}>
            <div className="col-xs-11">
              <h3>{name && name}</h3>
            </div>
            <div className="col-xs-1">
              <Adjust onClick={() => setViewport({})} className={styles.crosshairIcon} />
            </div>
          </div>
          <div className="col-xs-12">
            <Map
              className={styles.map}
              center={viewport.center}
              zoom={viewport.zoom}
              viewport={originalViewport}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {kml && <ReactLeafletKml kml={kml} />}
            </Map>
          </div>
          <div className={`col-xs-12 ${styles.statsWrapper}`}>
            <div className={`${styles.statWrapper} col-xs-3`}>
              <SettingsEthernet className={styles.icon} />
              <span>Distance: {distance} km</span>
            </div>
            <div className={`${styles.statWrapper} col-xs-3`}>
              <Timer className={styles.icon} />
              Duration: {time} h
            </div>
            <div className={`${styles.statWrapper} col-xs-3`}>
              <TrendingUp className={styles.icon} />
              Elevation gain: {ascent} m
            </div>
            <div className={`${styles.statWrapper} col-xs-3`}>
              <TrendingDown className={styles.icon} />
              Elevation loss: {descent} m
            </div>
          </div>
          <div className={`${styles.detailsWrapper} col-xs-12`}>
            <div className="col-xs-6">{description && description}</div>
            <div className="col-xs-offset-2 col-xs-4">
              <div>
                <strong>Date:</strong> {date}
              </div>
              <div>
                <strong>Start location:</strong> {start}
              </div>
              <div>
                <strong>Finish location:</strong> {finish}
              </div>
              <div>
                <strong>Country:</strong> {country}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HikeCard;
