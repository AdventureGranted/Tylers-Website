import { HiOutlineSparkles } from 'react-icons/hi';
import {
  SiCloudflare,
  SiDocker,
  SiGithubactions,
  SiHomeassistant,
  SiImmich,
  SiNvidia,
  SiPlex,
  SiProxmox,
  SiRadarr,
  SiSonarr,
} from 'react-icons/si';
import { TbToolsKitchen2 } from 'react-icons/tb';

// Services named in the project bullets, the About page and the AI context
const services = [
  { name: 'Plex', icon: SiPlex, color: 'text-[#e5a00d]' },
  { name: 'Sonarr', icon: SiSonarr, color: 'text-[#2fa8d8]' },
  { name: 'Radarr', icon: SiRadarr, color: 'text-[#e8a600]' },
  { name: 'Home Assistant', icon: SiHomeassistant, color: 'text-[#18bcf2]' },
  { name: 'Immich', icon: SiImmich, color: 'text-[#e1382c]' },
  { name: 'Mealie', icon: TbToolsKitchen2, color: 'text-[#e58325]' },
  { name: 'Open WebUI', icon: HiOutlineSparkles, color: 'text-accent' },
  { name: 'CI runner', icon: SiGithubactions, color: 'text-[#2088ff]' },
];

// A homelab dashboard panel: the Proxmox host and the services running on it
export function SelfHostingCover() {
  return (
    <div className="w-full max-w-[440px] rounded-xl border border-gray-300 bg-white/90 p-2.5 shadow-xl sm:p-3 dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold text-gray-900 sm:mb-2.5 dark:text-gray-200">
        <span className="flex items-center gap-1.5">
          <SiProxmox className="text-[#e57000]" />
          Proxmox
        </span>
        <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-400">
          <SiNvidia className="text-[#76b900]" />
          RTX 3090
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="relative flex flex-col items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-1 py-2 sm:py-2.5 dark:border-gray-700 dark:bg-gray-800"
          >
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />
            <service.icon
              className={`h-5 w-5 sm:h-6 sm:w-6 ${service.color}`}
            />
            <span className="w-full text-center text-[10px] leading-tight text-balance text-gray-700 sm:text-[11px] dark:text-gray-300">
              {service.name}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 hidden items-center justify-center gap-4 text-[11px] text-gray-700 sm:flex dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <SiDocker className="text-[#2496ed]" />
          Docker
        </span>
        <span className="flex items-center gap-1.5">
          <SiCloudflare className="text-[#f38020]" />
          Cloudflare Tunnel
        </span>
      </div>
    </div>
  );
}

const bins = [
  { x: 52, y: 110, label: 'Camping', lid: 'fill-gray-400 dark:fill-gray-500' },
  { x: 208, y: 110, label: 'Kitchen', lid: 'fill-gray-400 dark:fill-gray-500' },
  { x: 130, y: 28, label: 'Holiday', lid: 'fill-accent' },
];

// Labeled storage bins, the things the app keeps track of
export function BoxyCover() {
  return (
    <svg
      viewBox="0 0 400 225"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of three stacked storage bins labeled Camping, Kitchen and Holiday"
    >
      <ellipse
        cx="200"
        cy="208"
        rx="170"
        ry="8"
        className="fill-gray-900/10 dark:fill-black/30"
      />
      {bins.map((bin) => (
        <g key={bin.label} transform={`translate(${bin.x} ${bin.y})`}>
          {/* Tapered body */}
          <path
            d="M6 14 H134 L128 92 Q127 96 123 96 H17 Q13 96 12 92 Z"
            className="fill-gray-200 stroke-gray-400 dark:fill-gray-700 dark:stroke-gray-600"
            strokeWidth="1.5"
          />
          {/* Lid */}
          <rect
            x="0"
            y="4"
            width="140"
            height="14"
            rx="4"
            className={bin.lid}
          />
          {/* Handle slot */}
          <rect
            x="56"
            y="24"
            width="28"
            height="6"
            rx="3"
            className="fill-gray-400 dark:fill-gray-900"
          />
          {/* Label card */}
          <rect
            x="34"
            y="42"
            width="72"
            height="30"
            rx="4"
            className="fill-white stroke-gray-300 dark:fill-gray-100 dark:stroke-gray-500"
            strokeWidth="1"
          />
          <text
            x="70"
            y="62"
            textAnchor="middle"
            className="font-display fill-gray-900 text-[13px] font-semibold"
          >
            {bin.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
