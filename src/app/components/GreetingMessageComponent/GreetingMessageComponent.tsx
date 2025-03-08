import React, { useEffect, useState, FC } from 'react';
import moment from 'moment';
import styles from './GreetingMessageComponent.module.scss';

const GreetingMessageComponent: FC = () => {
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    const determineGreeting = (): void => {
      const currentHour: number = moment().hour();

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good Morning!');
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting('Good Afternoon!');
      } else {
        setGreeting('Good Evening!');
      }
    };

    determineGreeting();
  }, []);

  return (
    <div className={styles.mainDivStyle}>
      <p>{greeting}</p>
    </div>
  );
};

export default GreetingMessageComponent;
