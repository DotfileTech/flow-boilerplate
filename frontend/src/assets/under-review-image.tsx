import { ReactElement } from 'react';

export const UnderReviewImage = ({
  color,
}: {
  color: string;
}): ReactElement => {
  return (
    <svg
      width="47"
      height="79"
      viewBox="0 0 47 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M46.5 1H0.5V20.7166C0.5 21.2401 0.705237 21.7427 1.07165 22.1166L23.5 45L45.9283 22.1166C46.2948 21.7427 46.5 21.2401 46.5 20.7166V1Z"
        fill="#F3F6FE"
      />
      <path
        d="M1.07165 57.8834L23.5 35L45.9283 57.8834C46.2948 58.2573 46.5 58.7599 46.5 59.2834V79H0.5V59.2834C0.5 58.7599 0.705237 58.2573 1.07165 57.8834Z"
        fill="#F3F6FE"
      />
      <path
        opacity="0.39"
        d="M23.5 40V1H0.5V20.7199C0.5 21.2414 0.703749 21.7424 1.06781 22.1159L18.5 40H23.5Z"
        fill="#C9D7FF"
      />
      <path
        opacity="0.39"
        d="M23.5 40V79H0.5V59.2801C0.5 58.7586 0.703749 58.2576 1.06781 57.8841L18.5 40H23.5Z"
        fill="#C9D7FF"
      />
      <path
        d="M23.5 28.5V39.5V78H0.5V71.5H22V69.5V39.5L14.4142 31.9142C13.1543 30.6543 14.0466 28.5 15.8284 28.5H23.5Z"
        fill={color}
      />
      <path
        d="M23.5 28.5V39.5V78H46.5V71.5H25V39.5L32.5858 31.9142C33.8457 30.6543 32.9534 28.5 31.1716 28.5H23.5Z"
        fill={color}
      />
      <line
        x1="0.5"
        y1="78"
        x2="46.5"
        y2="78"
        stroke="#718096"
        strokeWidth="2"
      />
      <line x1="0.5" y1="1" x2="46.5" y2="1" stroke="#718096" strokeWidth="2" />
    </svg>
  );
};
