export const SkillIcon = ({ icon, color }: { icon: string; color: string }) => {
  return (
    <div className="relative w-16 h-16">
      <svg
        xmlSpace="preserve"
        viewBox="0 0 37.6 37.6"
        version="1.1"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="m18.8 0c-0.96 0-1.92 0.161-2.47 0.481l-13.1 7.98c-1.13 0.653-1.81 1.8-1.81 3.03v14.6c0 1.23 0.684 2.37 1.81 3.03l13.1 7.98c1.11 0.642 3.85 0.665 4.95 0l13.1-7.98c1.11-0.677 1.81-1.8 1.81-3.03v-14.6c0-1.23-0.699-2.35-1.81-3.03l-13.1-7.98c-0.554-0.321-1.51-0.481-2.47-0.481z"
          fill={color}
        ></path>
      </svg>
      <img
        src={icon}
        className="absolute inset-0 w-full h-full object-contain"
      ></img>
    </div>
  )
}
