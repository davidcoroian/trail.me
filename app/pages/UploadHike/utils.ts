import Firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

export const extractDataFromKml = (xmlDom, setHikeData, hikeData, fileName) => {
  if (
    xmlDom.getElementsByName('time').length &&
    xmlDom.getElementsByName('time')[0].getElementsByTagName('value').length &&
    xmlDom.getElementsByName('time')[0].getElementsByTagName('value')[0].childNodes[0].nodeValue
  ) {
    setHikeData({
      ...hikeData,
      fileName,
      time: xmlDom.getElementsByName('time')[0].getElementsByTagName('value')[0].childNodes[0]
        .nodeValue,
      ascent: xmlDom.getElementsByName('ascent')[0].getElementsByTagName('value')[0].childNodes[0]
        .nodeValue,
      descent: xmlDom.getElementsByName('descent')[0].getElementsByTagName('value')[0].childNodes[0]
        .nodeValue,
    });
  }
};

export const onFileUpload = ({ rawKml, history, hikeData, photos }) => {
  const ref = Firebase.storage().ref();
  const photoRef = Firebase.storage().ref('images');

  const fileName = rawKml.name;
  const metadata = {
    contentType: rawKml.type,
  };

  photos.photoFiles.forEach(photoFile => {
    const photoName = photoFile.name;
    const photoMetadata = {
      contentType: photoFile.type,
    };

    photoRef.child(photoName).put(photoFile, photoMetadata);
  });

  ref
    .child(fileName)
    .put(rawKml, metadata)
    .then(snapshot => {
      snapshot.ref.getDownloadURL().then(kmlDownloadUrl => {
        Firebase.database()
          .ref()
          .child('hikes')
          .child(hikeData.date)
          .set({ ...hikeData, kmlDownloadUrl }, () => history.push('/'));
      });
    });
};

export const resizeMap = mapRef => {
  // eslint-disable-next-line no-underscore-dangle
  mapRef.current.leafletElement._onResize();
};

export const parseFile = e => {
  const text = e.target.result;

  const parser = new DOMParser();
  return parser.parseFromString(text, 'text/xml');
};

export const onFileChange = ({
  event,
  setRawKml,
  setKml,
  setHikeData,
  hikeData,
  setMissingFile,
}) => {
  const reader = new FileReader();
  const file = event.target.files[0];

  setRawKml(event.target.files[0]);
  const fileName = event.target.files[0].name;
  setMissingFile(false);

  reader.onloadend = e => {
    const xmlDom = parseFile(e);

    setKml(xmlDom);
    extractDataFromKml(xmlDom, setHikeData, hikeData, fileName);
  };
  reader.readAsText(file);
};

export const validateAndHandleSubmit = ({
  setHikeData,
  hikeData,
  data,
  setMissingFile,
  switchMapSize,
}) => {
  // eslint-disable-next-line no-param-reassign
  data.date = new Date(data.date).getTime();
  setHikeData({ ...hikeData, ...data });
  if (!hikeData.fileName) {
    setMissingFile(true);
  } else {
    switchMapSize();
  }
};

export const initialStatePhotoData = {
  url: '',
  long: '',
  lat: '',
};

export const setMarkers = ({
  setHikeData,
  hikeData,
  photoData,
  setPhotoData,
  photos,
  setPhotos,
}) => {
  const { markers = [] } = hikeData;
  const { photoFiles = [] } = photos;
  markers.push({ content: photoData.file.name, position: [photoData.long, photoData.lat] });
  photoFiles.push(photoData.file);
  setHikeData({ ...hikeData, markers });
  setPhotos({ photoFiles });
  setPhotoData(initialStatePhotoData);
};

export const inputFieldsData1 = [
  {
    text: 'Hike name:',
    inputValue: 'name',
    className: 'col-xs-11',
  },
  {
    text: 'Distance (km):',
    inputValue: 'distance',
    className: 'col-xs-5',
  },
  {
    text: 'Duration (h):',
    inputValue: 'time',
    className: 'col-xs-5 col-xs-offset-1',
  },
  {
    text: 'Ascent (m):',
    inputValue: 'ascent',
    className: 'col-xs-5',
  },
  {
    text: 'Descent (m):',
    inputValue: 'descent',
    className: 'col-xs-5 col-xs-offset-1',
  },
];

export const inputFieldsData2 = [
  {
    text: 'Date:',
    inputValue: 'date',
    validationRule: { pattern: /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/ },
    type: 'date',
    inputLabelProps: { shrink: true },
    className: 'col-xs-5',
  },
  {
    text: 'Country',
    inputValue: 'country',
    type: 'text',
    className: 'col-xs-5 col-xs-offset-1',
  },
  {
    text: 'Start location:',
    inputValue: 'start',
    type: 'text',
    className: 'col-xs-5',
  },
  {
    text: 'Finish location:',
    inputValue: 'finish',
    type: 'text',
    className: 'col-xs-5 col-xs-offset-1',
  },
];
