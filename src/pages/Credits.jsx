import { Link } from 'react-router-dom';
import './Credits.css';

const CREDITS = [
  {
    photographer: 'Colton Sturgeon',
    profileUrl: 'https://unsplash.com/fr/@coltonsturgeon',
    photoUrl: 'https://unsplash.com/fr/photos/personne-en-veste-zippee-en-cuir-marron-oB7lLU9dwLc',
    description: 'Person in brown leather zip jacket',
  },
  {
    photographer: 'your_mamacita',
    profileUrl: 'https://unsplash.com/fr/@your_mamacita',
    photoUrl: 'https://unsplash.com/fr/photos/un-gros-plan-dune-personne-portant-une-veste-marron-ZSTRCczhpEU',
    description: 'Close-up of a person wearing a brown jacket',
  },
  {
    photographer: 'Adrian Ordonez',
    profileUrl: 'https://unsplash.com/fr/@adrianordonez',
    photoUrl: 'https://unsplash.com/fr/photos/homme-tenant-sa-veste-en-cuir-P0W27GRvyww',
    description: 'Man holding his leather jacket',
  },
  {
    photographer: 'Jon Grogan',
    profileUrl: 'https://unsplash.com/fr/@jongrogan110',
    photoUrl: 'https://unsplash.com/fr/photos/homme-portant-une-veste-en-cuir-marchant-a-cote-de-la-rue-jZfFJnwaLG4',
    description: 'Man wearing leather jacket walking beside the street',
  },
  {
    photographer: 'Neil Wallace',
    profileUrl: 'https://unsplash.com/fr/@ostreet',
    photoUrl: 'https://unsplash.com/fr/photos/quatre-vestes-en-cuir-assorties-accrochees-a-un-mur-de-briques-brunes-eTCogYz7kQE',
    description: 'Four assorted leather jackets hung on a brown brick wall',
  },
  {
    photographer: 'Robbie Noble',
    profileUrl: 'https://unsplash.com/fr/@rbbnbl',
    photoUrl: 'https://unsplash.com/fr/photos/coussin-en-cuir-marron-ruNmAlLLnpo',
    description: 'Brown leather cushion',
  },
  {
    photographer: 'Mohammad Javad Asgharikolahi',
    profileUrl: 'https://unsplash.com/fr/@mojak8731',
    photoUrl: 'https://unsplash.com/fr/photos/gros-plan-dun-materiau-en-cuir-rouge-UWkvDN4fPhQ',
    description: 'Close-up of red leather material',
  },
  {
    photographer: 'Vinoth Ragunathan',
    profileUrl: 'https://unsplash.com/fr/@helvetiica',
    photoUrl: 'https://unsplash.com/fr/photos/une-montre-posee-sur-un-sac-en-cuir-marron-YYSQizkOkvM',
    description: 'Watch on a brown leather bag',
  },
];

function Credits() {
  return (
    <main className="credits">
      <section className="credits__hero">
        <div className="container">
          <span className="label">Acknowledgements</span>
          <h1 className="credits__title">Photo <em>Credits</em></h1>
          <p className="credits__intro">
            Beautiful photography is at the heart of our visual identity. We are grateful to the
            talented photographers who share their work on{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="credits__unsplash-link">
              Unsplash
            </a>.
          </p>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="credits__grid">
            {CREDITS.map((c, i) => (
              <div className="credits__card" key={i}>
                <span className="credits__number">{String(i + 1).padStart(2, '0')}</span>
                <div className="credits__card-body">
                  <h3 className="credits__photographer">
                    <a href={c.profileUrl} target="_blank" rel="noopener noreferrer">
                      {c.photographer}
                    </a>
                  </h3>
                  <p className="credits__desc">{c.description}</p>
                  <a
                    href={c.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="credits__photo-link"
                  >
                    View on Unsplash
                    <span className="material-symbols-outlined">open_in_new</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="credits__license">
            <span className="material-symbols-outlined credits__license-icon">license</span>
            <p>
              All photographs are used under the{' '}
              <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
                Unsplash License
              </a>{' '}
              — free to use for commercial and non-commercial purposes. No permission needed, but
              attribution is always appreciated.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Credits;
