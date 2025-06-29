import React, { FunctionComponent } from 'react'

interface Props {
  image: string
}
const MacbookMockup: FunctionComponent<Props> = ( { image } ) => {
  return (
    <svg
      className="bg-[url('/me-2.png')]"
      width="297"
      height="184"
      viewBox="0 0 297 184"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_153_90)">
        <path
          d="M263.053 165.539L33.8019 165.539C31.3284 165.539 25.3415 166.185 20.4298 166.981C15.518 167.777 13.8409 168.423 16.6838 168.423L280.171 168.423C283.014 168.423 281.337 167.777 276.425 166.981C271.514 166.185 265.527 165.539 263.053 165.539Z"
          fill="black"
          fillOpacity="0.4"
        />
      </g>
      <g filter="url(#filter1_dd_153_90)">
        <path
          d="M266.362 13.0757C266.362 9.19881 266.362 7.26039 265.604 5.77963C264.939 4.47712 263.876 3.41815 262.569 2.75448C261.083 2 259.138 2 255.248 2L41.7518 1.99998C37.8617 1.99998 35.9167 1.99998 34.431 2.75446C33.124 3.41813 32.0614 4.4771 31.3955 5.77961C30.6385 7.26037 30.6385 9.19879 30.6385 13.0756L30.6385 152.156C30.6385 156.033 30.6385 157.971 31.3955 159.452C32.0614 160.754 33.124 161.813 34.4309 162.477C35.9167 163.231 37.8617 163.231 41.7517 163.231L255.248 163.231C259.138 163.231 261.083 163.231 262.569 162.477C263.876 161.813 264.939 160.754 265.604 159.452C266.361 157.971 266.361 156.033 266.361 152.156L266.362 13.0757Z"
          fill="#3A4245"
        />
      </g>
      <path
        d="M265.783 12.7295C265.783 9.17575 265.783 7.39887 265.089 6.0415C264.478 4.84754 263.504 3.87681 262.306 3.26845C260.944 2.57684 259.161 2.57684 255.596 2.57684L41.4045 2.57682C37.8387 2.57682 36.0557 2.57682 34.6938 3.26843C33.4957 3.87679 32.5217 4.84752 31.9113 6.04148C31.2173 7.39885 31.2173 9.17573 31.2173 12.7295L31.2173 152.502C31.2173 156.056 31.2173 157.833 31.9113 159.19C32.5217 160.384 33.4957 161.355 34.6938 161.963C36.0557 162.655 37.8387 162.655 41.4045 162.655L255.596 162.655C259.161 162.655 260.944 162.655 262.306 161.963C263.504 161.355 264.478 160.384 265.089 159.19C265.783 157.833 265.783 156.056 265.783 152.502L265.783 12.7295Z"
        fill="#262C2D"
      />
      <path
        d="M265.204 12.3834C265.204 9.15269 265.204 7.53734 264.573 6.30338C264.018 5.21795 263.133 4.33547 262.043 3.78242C260.805 3.15369 259.184 3.15369 255.943 3.15369L41.0572 3.15367C37.8155 3.15367 36.1946 3.15367 34.9565 3.7824C33.8674 4.33545 32.9819 5.21793 32.427 6.30336C31.7961 7.53732 31.7961 9.15267 31.7961 12.3834L31.7961 152.848C31.7961 156.079 31.7961 157.694 32.4269 158.928C32.9819 160.013 33.8673 160.896 34.9565 161.449C36.1946 162.078 37.8155 162.078 41.0571 162.078L255.943 162.078C259.184 162.078 260.805 162.078 262.043 161.449C263.133 160.896 264.018 160.013 264.573 158.928C265.204 157.694 265.204 156.079 265.204 152.848L265.204 12.3834Z"
        fill="#121515"
      />
      <rect
        width="233.408"
        height="4.32642"
        transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 265.204 154.434)"
        fill="#262C2D"
      />
      <mask
        id="mask0_153_90"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="36"
        y="11"
        width="225"
        height="140"
      >
        <rect
          width="223.568"
          height="139.311"
          transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 260.284 11.5181)"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_153_90)">
        {/* <rect x="37" y="12" width="223" height="139" fill="currentColor" /> */}
        <image x="37"
          y="12"
          width="223"
          height="139"
          xlinkHref={image}
        ></image>
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M148.5 8.48961C148.06 8.48961 147.704 8.1345 147.704 7.69644C147.704 7.25838 148.06 6.90326 148.5 6.90326C148.94 6.90326 149.296 7.25838 149.296 7.69644C149.296 8.1345 148.94 8.48961 148.5 8.48961Z"
        fill="#262C2D"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M148.5 8.19216C148.225 8.19216 148.003 7.97021 148.003 7.69642C148.003 7.42263 148.225 7.20068 148.5 7.20068C148.775 7.20068 148.997 7.42263 148.997 7.69642C148.997 7.97021 148.775 8.19216 148.5 8.19216Z"
        fill="#121515"
      />
      <path
        opacity="0.4"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M148.5 7.59728C148.445 7.59728 148.4 7.55289 148.4 7.49813C148.4 7.44338 148.445 7.39899 148.5 7.39899C148.555 7.39899 148.599 7.44338 148.599 7.49813C148.599 7.55289 148.555 7.59728 148.5 7.59728Z"
        fill="#636F73"
      />
      <path
        d="M294 159.049C294 158.89 293.87 158.761 293.711 158.761L148.789 158.761C148.63 158.761 148.5 158.89 148.5 159.049L148.5 163.231L294 163.231L294 159.049Z"
        fill="url(#paint0_linear_153_90)"
      />
      <path
        d="M3.07239 159.049C3.07239 158.89 3.20196 158.761 3.3618 158.761L148.283 158.761C148.443 158.761 148.572 158.89 148.572 159.049L148.572 163.231L3.07239 163.231L3.07239 159.049Z"
        fill="url(#paint1_linear_153_90)"
      />
      <path
        d="M165.937 161.934L131.063 161.934C129.225 161.934 127.735 160.513 127.735 158.761L169.265 158.761C169.265 160.513 167.775 161.934 165.937 161.934Z"
        fill="#4E4F53"
      />
      <path
        d="M165.937 161.934L131.063 161.934C129.225 161.934 127.735 160.513 127.735 158.761L169.265 158.761C169.265 160.513 167.775 161.934 165.937 161.934Z"
        fill="url(#paint2_linear_153_90)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M148.717 163.231L294 163.231C294 163.231 287.633 167.269 266.723 167.269L148.717 167.269L148.428 167.269L30.2767 167.269C9.36697 167.269 3 163.231 3 163.231L148.428 163.231L148.717 163.231Z"
        fill="url(#paint3_linear_153_90)"
      />
      <path
        d="M294 159.049C294 158.89 293.87 158.761 293.711 158.761L148.789 158.761C148.63 158.761 148.5 158.89 148.5 159.049L148.5 163.231L294 163.231L294 159.049Z"
        fill="url(#paint4_linear_153_90)"
      />
      <path
        d="M3.07239 159.049C3.07239 158.89 3.20196 158.761 3.3618 158.761L148.283 158.761C148.443 158.761 148.572 158.89 148.572 159.049L148.572 163.231L3.07239 163.231L3.07239 159.049Z"
        fill="url(#paint5_linear_153_90)"
      />
      <path
        d="M165.937 161.934L131.063 161.934C129.225 161.934 127.735 160.513 127.735 158.761L169.265 158.761C169.265 160.513 167.775 161.934 165.937 161.934Z"
        fill="#ABAEB0"
      />
      <path
        d="M166.082 161.934L131.208 161.934C129.37 161.934 127.88 160.513 127.88 158.761L169.41 158.761C169.41 160.513 167.92 161.934 166.082 161.934Z"
        fill="url(#paint6_linear_153_90)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M148.717 163.231L294 163.231C294 163.231 287.633 167.269 266.723 167.269L148.717 167.269L148.428 167.269L30.2767 167.269C9.36697 167.269 3 163.231 3 163.231L148.428 163.231L148.717 163.231Z"
        fill="url(#paint7_linear_153_90)"
      />
      <defs>
        <filter
          id="filter0_f_153_90"
          x="0.299805"
          y="150.539"
          width="296.256"
          height="32.8843"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0"
            result="BackgroundImageFix"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="7.5"
            result="effect1_foregroundBlur_153_90"
          />
        </filter>
        <filter
          id="filter1_dd_153_90"
          x="26.6384"
          y="0"
          width="243.723"
          height="169.231"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0"
            result="BackgroundImageFix"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.0823529 0 0 0 0 0.25098 0 0 0 0.14 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_153_90"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.0823529 0 0 0 0 0.25098 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_153_90"
            result="effect2_dropShadow_153_90"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_153_90"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_153_90"
          x1="294"
          y1="161.068"
          x2="148.5"
          y2="161.068"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#303135" />
          <stop offset="0.0218797"
            stopColor="#535458"
          />
          <stop offset="0.0363004"
            stopColor="#4D4E52"
          />
          <stop offset="0.05818"
            stopColor="#333438"
          />
          <stop offset="0.0865241"
            stopColor="#35363A"
          />
          <stop offset="0.135753"
            stopColor="#4E4F53"
          />
          <stop offset="0.756906"
            stopColor="#818286"
          />
          <stop offset="1"
            stopColor="#818286"
          />
        </linearGradient>
        <linearGradient
          id="paint1_linear_153_90"
          x1="3.07239"
          y1="161.068"
          x2="148.572"
          y2="161.068"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#303135" />
          <stop offset="0.0218797"
            stopColor="#535458"
          />
          <stop offset="0.0363004"
            stopColor="#4D4E52"
          />
          <stop offset="0.05818"
            stopColor="#333438"
          />
          <stop offset="0.0865241"
            stopColor="#35363A"
          />
          <stop offset="0.135753"
            stopColor="#4E4F53"
          />
          <stop offset="0.756906"
            stopColor="#818286"
          />
          <stop offset="1"
            stopColor="#818286"
          />
        </linearGradient>
        <linearGradient
          id="paint2_linear_153_90"
          x1="169.265"
          y1="160.347"
          x2="127.735"
          y2="160.347"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopOpacity="0.5" />
          <stop offset="0.139373"
            stopColor="#818487"
            stopOpacity="0"
          />
          <stop offset="0.860627"
            stopColor="#818487"
            stopOpacity="0"
          />
          <stop offset="1"
            stopOpacity="0.5"
          />
        </linearGradient>
        <linearGradient
          id="paint3_linear_153_90"
          x1="148.5"
          y1="163.231"
          x2="148.5"
          y2="167.269"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#303135" />
          <stop offset="1"
            stopColor="#08090D"
          />
        </linearGradient>
        <linearGradient
          id="paint4_linear_153_90"
          x1="294"
          y1="161.068"
          x2="148.5"
          y2="161.068"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#717576" />
          <stop offset="0.016907"
            stopColor="#9C9FA1"
          />
          <stop offset="0.0353058"
            stopColor="#9C9FA1"
          />
          <stop offset="0.0571855"
            stopColor="#797E82"
          />
          <stop offset="0.0979612"
            stopColor="#797E82"
          />
          <stop offset="0.151169"
            stopColor="#B2B5B7"
          />
          <stop offset="0.756906"
            stopColor="#CACDCF"
          />
          <stop offset="1"
            stopColor="#CACDCF"
          />
        </linearGradient>
        <linearGradient
          id="paint5_linear_153_90"
          x1="3.07239"
          y1="161.068"
          x2="148.572"
          y2="161.068"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#717576" />
          <stop offset="0.016907"
            stopColor="#9C9FA1"
          />
          <stop offset="0.0353058"
            stopColor="#9C9FA1"
          />
          <stop offset="0.0571855"
            stopColor="#797E82"
          />
          <stop offset="0.0979612"
            stopColor="#797E82"
          />
          <stop offset="0.151169"
            stopColor="#B2B5B7"
          />
          <stop offset="0.756906"
            stopColor="#CACDCF"
          />
          <stop offset="1"
            stopColor="#CACDCF"
          />
        </linearGradient>
        <linearGradient
          id="paint6_linear_153_90"
          x1="169.41"
          y1="160.347"
          x2="127.88"
          y2="160.347"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopOpacity="0.5" />
          <stop offset="0.139373"
            stopColor="#818487"
            stopOpacity="0"
          />
          <stop offset="0.860627"
            stopColor="#818487"
            stopOpacity="0"
          />
          <stop offset="1"
            stopOpacity="0.5"
          />
        </linearGradient>
        <linearGradient
          id="paint7_linear_153_90"
          x1="148.5"
          y1="163.231"
          x2="148.5"
          y2="167.269"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#838688" />
          <stop offset="1"
            stopColor="#17191B"
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default MacbookMockup
