'use client'

import { useState } from 'react'
import { STATES_AND_SCHOOLS } from '@/lib/states-and-schools'

interface USMapProps {
  onStateSelect: (stateCode: string) => void
  selectedState?: string | null
}

export default function USMap({ onStateSelect, selectedState }: USMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  const handleStateClick = (stateCode: string) => {
    onStateSelect(stateCode)
  }

  // Helper function to calculate bounding box from SVG path
  const getBoundingBoxFromPath = (pathData: string) => {
    const coords = pathData.match(/(\d+(?:\.\d+)?)/g)?.map(Number) || []
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    for (let i = 0; i < coords.length; i += 2) {
      const x = coords[i]
      const y = coords[i + 1]
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }

    return { minX, minY, maxX, maxY }
  }

  // US state shapes approximated with polygons for more realistic map appearance
  const stateShapes = {
    // Northeast - compact and irregular shapes
    ME: "M870,120 L885,115 L890,125 L880,130 L875,140 L865,135 L860,125 Z", // Maine - irregular eastern shape
    NH: "M845,145 L855,142 L860,152 L850,158 L840,155 L835,145 Z", // New Hampshire - small triangular
    VT: "M820,140 L830,135 L835,150 L825,155 L815,150 L810,140 Z", // Vermont - vertical rectangle
    MA: "M835,165 L850,160 L855,175 L845,180 L835,178 L830,165 Z", // Massachusetts - compact
    RI: "M855,185 L865,182 L868,190 L860,195 L852,192 L850,185 Z", // Rhode Island - tiny square
    CT: "M830,185 L840,180 L845,195 L835,200 L825,197 L822,185 Z", // Connecticut - thin rectangle
    NY: "M795,150 L825,145 L830,165 L820,175 L805,180 L790,170 L785,155 Z", // New York - irregular
    NJ: "M805,185 L815,180 L820,195 L810,200 L800,198 L795,185 Z", // New Jersey - small rectangle
    PA: "M775,180 L805,175 L810,195 L800,205 L785,210 L765,200 L760,185 Z", // Pennsylvania - large irregular
    DE: "M790,205 L800,202 L802,212 L792,215 L785,210 Z", // Delaware - tiny triangle
    MD: "M775,215 L795,210 L800,225 L785,230 L770,225 Z", // Maryland - pentagon shape
    WV: "M745,205 L765,200 L770,220 L755,225 L740,220 L735,205 Z", // West Virginia - irregular
    VA: "M755,230 L785,225 L790,250 L775,255 L750,250 L745,235 Z", // Virginia - larger irregular

    // South - varied shapes
    NC: "M745,255 L775,250 L780,270 L765,275 L745,272 L740,260 Z", // North Carolina - coastal curve
    SC: "M735,275 L765,270 L768,285 L755,290 L735,287 L730,275 Z", // South Carolina - coastal
    GA: "M695,275 L735,270 L740,295 L720,300 L695,297 L690,280 Z", // Georgia - larger irregular
    FL: "M690,300 L750,295 L755,340 L745,355 L720,360 L690,355 L685,320 Z", // Florida - long peninsula
    AL: "M655,275 L685,270 L690,295 L675,300 L650,297 L645,275 Z", // Alabama - rectangular
    MS: "M615,275 L645,270 L650,295 L635,300 L610,297 L605,275 Z", // Mississippi - rectangular
    TN: "M655,240 L685,235 L690,255 L675,260 L650,257 L645,240 Z", // Tennessee - compact
    KY: "M685,235 L715,230 L720,250 L705,255 L680,252 L675,235 Z", // Kentucky - irregular
    AR: "M575,275 L605,270 L610,300 L595,305 L570,302 L565,275 Z", // Arkansas - tall rectangle
    LA: "M575,305 L605,300 L610,325 L595,330 L570,327 L565,305 Z", // Louisiana - irregular south

    // Midwest - rectangular and square shapes
    OH: "M725,210 L745,205 L750,225 L735,230 L715,225 Z", // Ohio - compact
    IN: "M685,210 L705,205 L710,225 L695,230 L675,225 Z", // Indiana - square
    IL: "M635,210 L665,205 L670,235 L655,240 L625,235 Z", // Illinois - tall rectangle
    MI: "M685,165 L725,160 L730,185 L715,190 L680,185 Z", // Michigan - distinctive shape
    WI: "M625,165 L655,160 L660,180 L645,185 L615,180 Z", // Wisconsin - pentagon
    MN: "M575,135 L615,130 L620,155 L605,160 L565,155 Z", // Minnesota - northern irregular
    IA: "M575,195 L605,190 L610,210 L595,215 L565,210 Z", // Iowa - rectangle
    MO: "M575,235 L615,230 L620,255 L605,260 L565,255 Z", // Missouri - rectangle
    ND: "M525,115 L555,110 L560,125 L545,130 L515,125 Z", // North Dakota - northern
    SD: "M525,145 L555,140 L560,155 L545,160 L515,155 Z", // South Dakota - square
    NE: "M525,175 L555,170 L560,185 L545,190 L515,185 Z", // Nebraska - rectangle
    KS: "M525,205 L555,200 L560,220 L545,225 L515,220 Z", // Kansas - rectangle

    // Plains/Southwest - larger shapes
    OK: "M525,250 L555,245 L560,265 L545,270 L515,265 Z", // Oklahoma - rectangle
    TX: "M485,270 L555,265 L560,310 L545,320 L485,315 L475,285 Z", // Texas - large irregular
    NM: "M425,265 L455,260 L460,290 L445,295 L415,290 Z", // New Mexico - square
    CO: "M425,205 L455,200 L460,225 L445,230 L415,225 Z", // Colorado - square

    // Mountain West - varied western shapes
    WY: "M385,160 L415,155 L420,175 L405,180 L375,175 Z", // Wyoming - square
    MT: "M345,110 L415,105 L420,130 L405,135 L335,130 Z", // Montana - wide rectangle
    ID: "M285,130 L315,125 L320,155 L305,160 L275,155 Z", // Idaho - tall irregular
    UT: "M325,185 L355,180 L360,205 L345,210 L315,205 Z", // Utah - compact
    AZ: "M285,235 L335,230 L340,255 L325,260 L275,255 Z", // Arizona - irregular
    NV: "M205,165 L235,160 L240,195 L225,200 L195,195 Z", // Nevada - tall rectangle

    // West Coast - distinctive shapes
    WA: "M125,95 L155,90 L160,115 L145,120 L115,115 Z", // Washington - northern irregular
    OR: "M125,145 L155,140 L160,160 L145,165 L115,160 Z", // Oregon - rectangle
    CA: "M85,165 L115,160 L120,205 L105,210 L75,205 Z", // California - tall coastal

    // Alaska & Hawaii - positioned separately
    AK: "M55,430 L105,425 L110,445 L95,450 L45,445 Z", // Alaska - wide northern
    HI: "M205,440 L245,435 L250,450 L240,455 L195,450 Z", // Hawaii - chain-like
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200 p-6 shadow-lg">
      <div className="relative">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-auto max-h-96 drop-shadow-sm"
          style={{ aspectRatio: '1000/600' }}
        >
          {/* US Map Background Image */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1"/>
            </filter>
            {/* Realistic US Map Outline */}
            <g id="usMapOutline">
              {/* Western States */}
              <path d="M80,180 L80,250 L120,240 L130,200 L140,180 L120,170 L100,160 L80,170 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M120,100 L150,95 L180,120 L190,150 L170,170 L140,160 L120,140 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M120,150 L150,145 L170,170 L160,190 L130,180 L120,170 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M200,160 L250,155 L280,185 L270,210 L230,200 L200,190 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M280,140 L320,135 L340,160 L330,180 L300,175 L280,160 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M200,200 L240,195 L250,220 L230,235 L200,230 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M280,200 L320,195 L330,220 L310,235 L280,230 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M340,120 L380,115 L400,140 L390,160 L360,155 L340,140 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M400,160 L440,155 L450,180 L430,195 L400,190 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M420,200 L460,195 L470,220 L450,235 L420,230 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M500,180 L540,175 L550,200 L530,215 L500,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M520,210 L560,205 L570,230 L550,245 L520,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M480,240 L520,235 L530,260 L510,275 L480,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M420,240 L460,235 L470,260 L450,275 L420,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M340,170 L380,165 L390,190 L370,205 L340,200 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M320,200 L360,195 L370,220 L350,235 L320,230 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M240,240 L280,235 L290,260 L270,275 L240,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M200,240 L240,235 L250,260 L230,275 L200,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M160,240 L200,235 L210,260 L190,275 L160,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M120,240 L160,235 L170,260 L150,275 L120,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M80,240 L120,235 L130,260 L110,275 L80,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>

              {/* Central States */}
              <path d="M520,120 L560,115 L570,140 L550,155 L520,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M520,150 L560,145 L570,170 L550,185 L520,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M480,120 L520,115 L530,140 L510,155 L480,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M480,150 L520,145 L530,170 L510,185 L480,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M520,180 L560,175 L570,200 L550,215 L520,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M520,210 L560,205 L570,230 L550,245 L520,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M480,180 L520,175 L530,200 L510,215 L480,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M480,210 L520,205 L530,230 L510,245 L480,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M560,120 L600,115 L610,140 L590,155 L560,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M600,120 L640,115 L650,140 L630,155 L600,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M640,120 L680,115 L690,140 L670,155 L640,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M680,120 L720,115 L730,140 L710,155 L680,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M560,150 L600,145 L610,170 L590,185 L560,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M600,150 L640,145 L650,170 L630,185 L600,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M640,150 L680,145 L690,170 L670,185 L640,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M680,150 L720,145 L730,170 L710,185 L680,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M560,180 L600,175 L610,200 L590,215 L560,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M600,180 L640,175 L650,200 L630,215 L600,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M640,180 L680,175 L690,200 L670,215 L640,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M680,180 L720,175 L730,200 L710,215 L680,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M560,210 L600,205 L610,230 L590,245 L560,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M600,210 L640,205 L650,230 L630,245 L600,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M640,210 L680,205 L690,230 L670,245 L640,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M680,210 L720,205 L730,230 L710,245 L680,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>

              {/* Eastern States */}
              <path d="M720,120 L760,115 L770,140 L750,155 L720,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M760,120 L800,115 L810,140 L790,155 L760,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M800,120 L840,115 L850,140 L830,155 L800,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M840,120 L880,115 L890,140 L870,155 L840,150 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M720,150 L760,145 L770,170 L750,185 L720,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M760,150 L800,145 L810,170 L790,185 L760,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M800,150 L840,145 L850,170 L830,185 L800,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M840,150 L880,145 L890,170 L870,185 L840,180 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M720,180 L760,175 L770,200 L750,215 L720,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M760,180 L800,175 L810,200 L790,215 L760,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M800,180 L840,175 L850,200 L830,215 L800,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M840,180 L880,175 L890,200 L870,215 L840,210 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M720,210 L760,205 L770,230 L750,245 L720,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M760,210 L800,205 L810,230 L790,245 L760,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M800,210 L840,205 L850,230 L830,245 L800,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M840,210 L880,205 L890,230 L870,245 L840,240 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>

              {/* Southern States */}
              <path d="M720,240 L760,235 L770,260 L750,275 L720,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M760,240 L800,235 L810,260 L790,275 L760,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M800,240 L840,235 L850,260 L830,275 L800,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M680,240 L720,235 L730,260 L710,275 L680,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M640,240 L680,235 L690,260 L670,275 L640,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M600,240 L640,235 L650,260 L630,275 L600,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M560,240 L600,235 L610,260 L590,275 L560,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M520,240 L560,235 L570,260 L550,275 L520,270 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M480,270 L520,265 L530,290 L510,305 L480,300 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M520,270 L560,265 L570,290 L550,305 L520,300 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M560,270 L600,265 L610,290 L590,305 L560,300 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M600,270 L640,265 L650,290 L630,305 L600,300 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M640,270 L680,265 L690,290 L670,305 L640,300 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M680,270 L720,265 L730,290 L710,305 L680,300 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M720,270 L760,265 L770,290 L750,305 L720,300 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M760,270 L800,265 L810,290 L790,305 L760,300 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M480,300 L520,295 L530,320 L510,335 L480,330 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M520,300 L560,295 L570,320 L550,335 L520,330 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M560,300 L600,295 L610,320 L590,335 L560,330 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M600,300 L640,295 L650,320 L630,335 L600,330 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M640,300 L680,295 L690,320 L670,335 L640,330 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M680,300 L720,295 L730,320 L710,335 L680,330 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M720,300 L760,295 L770,320 L750,335 L720,330 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M760,300 L800,295 L810,320 L790,335 L760,330 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M690,330 L730,325 L740,350 L720,365 L690,360 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M730,330 L770,325 L780,350 L760,365 L730,360 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M770,330 L810,325 L820,350 L800,365 L770,360 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M810,330 L850,325 L860,350 L840,365 L810,360 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M690,360 L730,355 L740,380 L720,395 L690,390 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M730,360 L770,355 L780,380 L760,395 L730,390 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M770,360 L810,355 L820,380 L800,395 L770,390 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M810,360 L850,355 L860,380 L840,395 L810,390 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M690,390 L730,385 L740,410 L720,425 L690,420 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M730,390 L770,385 L780,410 L760,425 L730,420 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M770,390 L810,385 L820,410 L800,425 L770,420 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
              <path d="M810,390 L850,385 L860,410 L840,425 L810,420 Z" fill="#e8f4fd" stroke="#94a3b8" strokeWidth="1"/>
            </g>
          </defs>

          {/* US Map Background */}
          <rect width="1000" height="600" fill="#f0f9ff" stroke="#cbd5e1" strokeWidth="1" rx="8" />
          <use href="#usMapOutline" />

          {/* State shapes with enhanced styling */}
          {Object.entries(stateShapes).map(([stateCode, path]) => {
            const state = STATES_AND_SCHOOLS.find(s => s.code === stateCode)
            const isSelected = selectedState === stateCode
            const isHovered = hoveredState === stateCode

            // Calculate centroid for text positioning
            const bbox = getBoundingBoxFromPath(path)
            const centerX = (bbox.minX + bbox.maxX) / 2
            const centerY = (bbox.minY + bbox.maxY) / 2

            return (
              <g key={stateCode}>
                {/* Shadow for depth */}
                <path
                  d={path}
                  fill="#000000"
                  fillOpacity={isHovered ? "0.15" : isSelected ? "0.2" : "0.05"}
                  transform="translate(2,2)"
                />

                {/* Main state shape */}
                <path
                  d={path}
                  fill={
                    isSelected
                      ? '#2563eb' // blue-600
                      : isHovered
                      ? '#dbeafe' // blue-100
                      : '#ffffff' // white
                  }
                  stroke={
                    isSelected
                      ? '#1d4ed8' // blue-700
                      : isHovered
                      ? '#3b82f6' // blue-500
                      : '#94a3b8' // slate-400
                  }
                  strokeWidth={isSelected ? "3" : isHovered ? "2" : "1.5"}
                  className={`cursor-pointer transition-all duration-300 ${
                    isHovered ? 'transform scale-105' : ''
                  }`}
                  filter={isHovered ? "url(#glow)" : ""}
                  onClick={() => handleStateClick(stateCode)}
                  onMouseEnter={() => setHoveredState(stateCode)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* Inner border for state definition */}
                <path
                  d={path}
                  fill="none"
                  stroke={
                    isSelected
                      ? '#1e40af' // blue-800
                      : isHovered
                      ? '#60a5fa' // blue-400
                      : '#cbd5e1' // slate-300
                  }
                  strokeWidth="1"
                  opacity={isHovered || isSelected ? "0.8" : "0.4"}
                />

                {/* State code text */}
                <text
                  x={centerX}
                  y={centerY + 4}
                  textAnchor="middle"
                  fontSize={isHovered ? "13" : "12"}
                  fontWeight="bold"
                  fill={isSelected ? '#ffffff' : isHovered ? '#1e40af' : '#374151'}
                  className="pointer-events-none select-none transition-all duration-300"
                >
                  {stateCode}
                </text>

                {/* State name tooltip on hover */}
                {isHovered && (
                  <text
                    x={centerX}
                    y={bbox.minY - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#1e40af"
                    className="pointer-events-none"
                  >
                    {state?.name}
                  </text>
                )}

                <title>{state?.name || stateCode}</title>
              </g>
            )
          })}

          {/* Subtle grid lines for map reference */}
          <g opacity="0.1" stroke="#64748b" strokeWidth="0.5">
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} />
            ))}
          </g>

        </svg>

        {/* Enhanced Legend/Info */}
        <div className="mt-4 text-center text-sm text-slate-600 bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200">
          🗺️ Interactive US Map - Click any state to select it. Hover for details!
        </div>
      </div>
    </div>
  )
}

