import React, { useEffect, useState } from "react";
import { MapContainer, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

const url =
  "https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&lang=EN&rows=50&sort=population&facet=timezone&facet=country";

const corner1 = Leaflet.latLng(-90, -200);
const corner2 = Leaflet.latLng(90, 200);
const bounds = Leaflet.latLngBounds(corner1, corner2);
export default function App() {
  const [cities, setCities] = useState();

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch(url);
        setCities(await res.json());
      } catch (err) {
        console.error(err);
      }
    }

    fetchCities();
  }, []);
  return (
    <div className="App">
      <h3 style={{ textAlign: "center" }}>
        50 Most Populated Cities in the World
      </h3>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        minZoom={1.5}
        style={{ height: "100vh", width: "100%" }}
        maxBounds={bounds}
        maxBoundsViscosity={0.4}
      >
        <TileLayer
          url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        {cities &&
          cities.records.map((city, i) => {
            return (
              <CircleMarker
                center={[
                  city.fields["coordinates"][0],
                  city.fields["coordinates"][1],
                ]}
                radius={1.5 * (city.fields.population / 1000000)}
                fillOpacity={0.4}
                stroke={true}
                key={city.recordid}
              >
                <Tooltip direction="top" offset={[0, -2]} opacity={1}>
                  <span>
                    {i + 1}. {city.fields.name} : {city.fields.population}
                  </span>
                </Tooltip>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}
