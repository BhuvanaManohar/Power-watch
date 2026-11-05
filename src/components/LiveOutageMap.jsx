import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { hasValidCoordinates } from '../lib/incidentAdapter';

const STATUS_COLOR_CONFIG = {
  investigating: {
    bg: '#b54000',
    border: '#8d3000',
    icon: 'bolt',
    pulse: true,
    label: 'Under Investigation',
  },
  progress: {
    bg: '#0048af',
    border: '#002b6e',
    icon: 'directions_car',
    pulse: false,
    label: 'Restoration in Progress',
  },
  resolved: {
    bg: '#006c4a',
    border: '#00432d',
    icon: 'check',
    pulse: false,
    label: 'Power Restored',
  },
  cancelled: {
    bg: '#737785',
    border: '#424654',
    icon: 'close',
    pulse: false,
    label: 'Cancelled',
  },
};

function createCustomMarkerIcon(incident, isSelected = false) {
  const config = STATUS_COLOR_CONFIG[incident.category] || {
    bg: '#0048af',
    border: '#002b6e',
    icon: 'bolt',
    pulse: false,
    label: incident.statusText || 'Incident',
  };

  const pulseRing = config.pulse
    ? `<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-70" style="background-color: ${config.bg};"></span>`
    : '';

  const selectedRing = isSelected
    ? 'ring-4 ring-primary ring-offset-2 scale-110 shadow-lg'
    : 'shadow-md';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group ${selectedRing} transition-transform" style="width: 32px; height: 32px;">
      ${pulseRing}
      <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-white z-10 transition-colors" style="background-color: ${config.bg};">
        <span class="material-symbols-outlined text-[16px]">${config.icon}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'powerwatch-live-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
    tooltipAnchor: [0, -18],
  });
}

export function LiveOutageMap({
  incidents = [],
  selectedIncidentId = null,
  onSelectIncident,
  onViewIncidentDetail,
  activeCount = 0,
  isLoading = false,
  error = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Initialize Leaflet map instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center (San Francisco / Municipal Grid coordinates fallback)
    const initialCenter = [37.7749, -122.4194];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    // OpenStreetMap standard tile layer adhering to OSM Tile Usage Policy.
    // Note: The public OSM tile server is provided under community fair-use policies and is not guaranteed for production SLA.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Responsive container resize observer
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Sync and plot incidents with valid coordinates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Plot incidents strictly when linked location has valid latitude and longitude
    const plottableIncidents = incidents.filter(hasValidCoordinates);

    if (plottableIncidents.length === 0) {
      return;
    }

    const bounds = [];

    plottableIncidents.forEach((incident) => {
      const lat = incident.latitude ?? incident.location?.latitude ?? incident.raw?.location?.latitude;
      const lng = incident.longitude ?? incident.location?.longitude ?? incident.raw?.location?.longitude;

      bounds.push([lat, lng]);

      const isSelected = selectedIncidentId === incident.id;
      const marker = L.marker([lat, lng], {
        icon: createCustomMarkerIcon(incident, isSelected),
        title: `${incident.areaName || incident.incidentId} (${incident.statusText})`,
      });

      // Hover Tooltip: safely constructed with DOM nodes and textContent
      const tooltipContainer = document.createElement('div');
      tooltipContainer.style.fontFamily = 'inherit';
      tooltipContainer.style.fontSize = '12px';
      tooltipContainer.style.lineHeight = '1.4';
      tooltipContainer.style.padding = '2px 4px';

      const tooltipTitle = document.createElement('div');
      tooltipTitle.style.fontWeight = '700';
      tooltipTitle.style.color = '#0d1c2e';
      tooltipTitle.textContent = incident.areaName || incident.incidentId || 'Incident';
      tooltipContainer.appendChild(tooltipTitle);

      const tooltipSub = document.createElement('div');
      tooltipSub.style.fontSize = '11px';
      tooltipSub.style.color = '#424654';
      tooltipSub.textContent = `${incident.statusText || ''}${incident.severity ? ` • ${incident.severity}` : ''}`;
      tooltipContainer.appendChild(tooltipSub);

      marker.bindTooltip(tooltipContainer, {
        direction: 'top',
        offset: [0, -18],
        opacity: 0.95,
      });

      // Interactive Popup: safely constructed with DOM elements and textContent
      const popupContainer = document.createElement('div');
      popupContainer.className = 'font-sans text-xs p-1 flex flex-col gap-2 max-w-[240px]';

      const popupHeader = document.createElement('div');
      popupHeader.className = 'flex items-center justify-between gap-1 border-b pb-1';

      const incidentBadge = document.createElement('span');
      incidentBadge.className = 'font-mono text-[11px] font-bold text-[#0048af] bg-[#dee5ff] px-1.5 py-0.5 rounded';
      incidentBadge.textContent = incident.incidentId || '';
      popupHeader.appendChild(incidentBadge);

      const statusBadge = document.createElement('span');
      statusBadge.className = 'text-[10px] font-bold uppercase tracking-wider text-[#424654]';
      statusBadge.textContent = incident.statusText || '';
      popupHeader.appendChild(statusBadge);

      popupContainer.appendChild(popupHeader);

      const popupBody = document.createElement('div');

      const areaHeading = document.createElement('h4');
      areaHeading.className = 'font-bold text-[#0d1c2e] text-sm leading-tight';
      areaHeading.textContent = incident.areaName || incident.incidentId || '';
      popupBody.appendChild(areaHeading);

      if (incident.investigationDetails) {
        const detailsP = document.createElement('p');
        detailsP.className = 'text-[11px] text-[#424654] pt-0.5';
        detailsP.textContent = incident.investigationDetails;
        popupBody.appendChild(detailsP);
      }

      const coordsDisplay = document.createElement('div');
      coordsDisplay.className = 'text-[10px] font-mono text-[#737785] pt-1';
      coordsDisplay.textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      popupBody.appendChild(coordsDisplay);

      popupContainer.appendChild(popupBody);

      const viewBtn = document.createElement('button');
      viewBtn.type = 'button';
      viewBtn.className = 'powerwatch-popup-view-btn w-full mt-1 px-3 py-1.5 rounded-md bg-[#0048af] text-white font-bold text-[11px] hover:bg-[#1e60d5] transition-colors cursor-pointer text-center';
      viewBtn.textContent = 'View Incident Record →';
      viewBtn.addEventListener('click', () => {
        if (onViewIncidentDetail) {
          onViewIncidentDetail(incident.id);
        }
      });
      popupContainer.appendChild(viewBtn);

      marker.bindPopup(popupContainer, { maxWidth: 260 });

      // Selecting marker selects incident and opens detail route
      marker.on('click', () => {
        if (onSelectIncident) {
          onSelectIncident(incident.id);
        }
        if (onViewIncidentDetail) {
          onViewIncidentDetail(incident.id);
        }
      });

      marker.addTo(markersLayer);

      if (isSelected) {
        marker.openPopup();
      }
    });

    // Fit map bounds to encompass all plotted incidents
    if (bounds.length === 1) {
      map.setView(bounds[0], 14, { animate: true });
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true });
    }
  }, [incidents, selectedIncidentId, onSelectIncident, onViewIncidentDetail]);

  const plottableCount = incidents.filter(hasValidCoordinates).length;
  const unplottedCount = incidents.length - plottableCount;

  return (
    <div className="relative w-full h-[480px] md:h-[520px] rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm bg-surface-container-lowest">
      {/* Leaflet Map DOM Host */}
      <div
        ref={mapContainerRef}
        className="w-full h-full z-0 focus:outline-none"
        style={{ minHeight: '100%', background: '#f8f9ff' }}
      />

      {/* Floating Status & Mapping Banner (Top-Left) */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1 pointer-events-none">
        <div className="p-space-sm rounded-xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 shadow-sm flex items-center gap-space-xs pointer-events-auto">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              activeCount > 0 ? 'bg-tertiary animate-pulse' : 'bg-secondary'
            }`}
          />
          <div>
            <p className="text-xs font-bold text-on-surface">
              {activeCount > 0
                ? `${activeCount} Active ${activeCount === 1 ? 'Area' : 'Areas'} Monitored`
                : 'Municipal Grid Stable — No Active Outages'}
            </p>
            <p className="text-[10px] text-on-surface-variant font-medium">
              {plottableCount > 0
                ? `${plottableCount} plotted on live map`
                : 'No incidents with geographic coordinates'}
            </p>
          </div>
        </div>

        {unplottedCount > 0 && incidents.length > 0 && (
          <div className="px-space-sm py-1 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/40 shadow-xs flex items-center gap-1.5 text-[11px] text-on-surface-variant pointer-events-auto">
            <span className="material-symbols-outlined text-[13px] text-outline">location_off</span>
            <span>{unplottedCount} without coordinates (in feed)</span>
          </div>
        )}
      </div>

      {/* Clearly Visible Map Legend (Bottom Overlay) */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] p-space-sm bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-sm text-xs text-on-surface-variant pointer-events-auto">
        <div className="flex flex-wrap items-center gap-space-md font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-tertiary" />
            <span className="text-on-surface">Active outage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-on-surface">Restoration in progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-on-surface">Restored</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-[15px] text-secondary">sync</span>
          <span>
            {isLoading ? 'Updating...' : error ? 'Offline' : 'Last updated: Just now'}
          </span>
        </div>
      </div>
    </div>
  );
}
