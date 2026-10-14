import { useEffect, useState } from 'react';

const CHARACTER_DELAY = 85;
const START_DELAY = 300;
const REPEAT_DELAY = 5000;

export default function TypingName({ firstName, lastName }) {
  const firstLine = Array.from(firstName);
  const secondLine = Array.from(`${lastName}.`);
  const total = firstLine.length + secondLine.length;
  const initialCount = firstLine.length > 0 ? 1 : 0;
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer;

    function start() {
      window.clearTimeout(timer);
      if (motionPreference.matches) {
        setVisibleCount(total);
        return;
      }

      setVisibleCount(initialCount);
      let next = initialCount;
      function typeCharacter() {
        next += 1;
        setVisibleCount(next);
        if (next < total) {
          timer = window.setTimeout(typeCharacter, CHARACTER_DELAY);
        } else {
          timer = window.setTimeout(start, REPEAT_DELAY);
        }
      }
      timer = window.setTimeout(typeCharacter, START_DELAY);
    }

    start();
    motionPreference.addEventListener('change', start);
    return () => {
      window.clearTimeout(timer);
      motionPreference.removeEventListener('change', start);
    };
  }, [firstName, lastName, total, initialCount]);

  function renderLine(characters, offset) {
    return characters.map((character, index) => {
      const position = offset + index + 1;
      const cursor = visibleCount === position;
      return (
        <span
          key={index}
          className={`typing-character${cursor ? ' typing-cursor' : ''}${cursor && visibleCount === total ? ' typing-complete' : ''}`}
          data-revealed={position <= visibleCount}
        >{character}</span>
      );
    });
  }

  return (
    <h1 id="hero-title" aria-label={`${firstName} ${lastName}.`}>
      <span className="typing-line" aria-hidden="true">{renderLine(firstLine, 0)}</span>
      <span className="typing-line" aria-hidden="true">{renderLine(secondLine, firstLine.length)}</span>
    </h1>
  );
}
