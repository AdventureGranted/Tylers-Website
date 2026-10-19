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

// A real, scannable QR code for https://tyler-grant.com (version 2, error
// correction M, 25x25 modules), one path per run of dark modules. Generated
// with the qrcode npm package: QRCode.create(url, { errorCorrectionLevel: 'M' }).
const QR_SIZE = 25;
const QR_PATH =
  'M0 0h7v1h-7zM10 0h2v1h-2zM13 0h1v1h-1zM16 0h1v1h-1zM18 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM9 1h2v1h-2zM12 1h5v1h-5zM18 1h1v1h-1zM24 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h1v1h-1zM10 2h1v1h-1zM12 2h1v1h-1zM15 2h1v1h-1zM18 2h1v1h-1zM20 2h3v1h-3zM24 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h1v1h-1zM10 3h1v1h-1zM12 3h4v1h-4zM18 3h1v1h-1zM20 3h3v1h-3zM24 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h2v1h-2zM14 4h1v1h-1zM16 4h1v1h-1zM18 4h1v1h-1zM20 4h3v1h-3zM24 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h2v1h-2zM12 5h1v1h-1zM14 5h2v1h-2zM18 5h1v1h-1zM24 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h7v1h-7zM8 7h3v1h-3zM0 8h1v1h-1zM2 8h5v1h-5zM13 8h1v1h-1zM15 8h2v1h-2zM18 8h5v1h-5zM1 9h1v1h-1zM5 9h1v1h-1zM8 9h1v1h-1zM10 9h4v1h-4zM16 9h2v1h-2zM19 9h1v1h-1zM23 9h1v1h-1zM1 10h1v1h-1zM6 10h1v1h-1zM8 10h2v1h-2zM13 10h4v1h-4zM21 10h1v1h-1zM23 10h2v1h-2zM1 11h3v1h-3zM9 11h2v1h-2zM12 11h1v1h-1zM16 11h4v1h-4zM24 11h1v1h-1zM0 12h1v1h-1zM2 12h5v1h-5zM8 12h1v1h-1zM10 12h1v1h-1zM12 12h4v1h-4zM17 12h4v1h-4zM22 12h3v1h-3zM0 13h1v1h-1zM2 13h2v1h-2zM5 13h1v1h-1zM7 13h1v1h-1zM9 13h1v1h-1zM16 13h1v1h-1zM19 13h1v1h-1zM21 13h1v1h-1zM23 13h1v1h-1zM0 14h1v1h-1zM2 14h1v1h-1zM4 14h5v1h-5zM11 14h3v1h-3zM15 14h3v1h-3zM19 14h3v1h-3zM23 14h2v1h-2zM0 15h1v1h-1zM4 15h2v1h-2zM11 15h1v1h-1zM14 15h3v1h-3zM18 15h3v1h-3zM24 15h1v1h-1zM0 16h1v1h-1zM2 16h6v1h-6zM10 16h2v1h-2zM13 16h2v1h-2zM16 16h5v1h-5zM22 16h1v1h-1zM8 17h1v1h-1zM12 17h2v1h-2zM15 17h2v1h-2zM20 17h2v1h-2zM0 18h7v1h-7zM10 18h1v1h-1zM13 18h2v1h-2zM16 18h1v1h-1zM18 18h1v1h-1zM20 18h1v1h-1zM22 18h3v1h-3zM0 19h1v1h-1zM6 19h1v1h-1zM8 19h1v1h-1zM10 19h1v1h-1zM12 19h1v1h-1zM14 19h3v1h-3zM20 19h2v1h-2zM23 19h1v1h-1zM0 20h1v1h-1zM2 20h3v1h-3zM6 20h1v1h-1zM8 20h1v1h-1zM12 20h9v1h-9zM22 20h3v1h-3zM0 21h1v1h-1zM2 21h3v1h-3zM6 21h1v1h-1zM8 21h1v1h-1zM13 21h1v1h-1zM15 21h4v1h-4zM20 21h5v1h-5zM0 22h1v1h-1zM2 22h3v1h-3zM6 22h1v1h-1zM8 22h1v1h-1zM11 22h2v1h-2zM14 22h2v1h-2zM21 22h2v1h-2zM24 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM11 23h1v1h-1zM14 23h1v1h-1zM16 23h6v1h-6zM24 23h1v1h-1zM0 24h7v1h-7zM8 24h1v1h-1zM10 24h3v1h-3zM17 24h8v1h-8z';

const bins = [
  { x: 52, y: 110, label: 'Camping', lid: 'fill-gray-400 dark:fill-gray-500' },
  { x: 208, y: 110, label: 'Kitchen', lid: 'fill-gray-400 dark:fill-gray-500' },
  { x: 130, y: 28, label: 'Holiday', lid: 'fill-accent' },
];

// Storage bins with QR-coded labels, the way the app tracks what's inside.
// The codes open tyler-grant.com.
export function BoxyCover() {
  return (
    <svg
      viewBox="0 0 400 225"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of three stacked storage bins labeled Camping, Kitchen and Holiday, each with a QR code that opens tyler-grant.com"
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
          {/* Label card: QR code, then the bin name. White in both themes
              so the code keeps its contrast. */}
          <rect
            x="16"
            y="38"
            width="108"
            height="42"
            rx="4"
            className="fill-white stroke-gray-300 dark:stroke-gray-500"
            strokeWidth="1"
          />
          <path
            d={QR_PATH}
            transform={`translate(21 43) scale(${32 / QR_SIZE})`}
            className="fill-gray-900"
            shapeRendering="crispEdges"
          />
          <text
            x="59"
            y="64"
            className="font-display fill-gray-900 text-[12px] font-semibold"
          >
            {bin.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
