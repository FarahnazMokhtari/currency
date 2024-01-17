"use client";
import { useState } from "react";
import { Img, Input, Text, VStack } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { Icon } from "@chakra-ui/react";

import "./Styles/style.css";

const fetchCurrency = async (countryName) => {
  const response = await fetch("https://datastory-cloud-v2.stellate.sh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetCurrency($countryName: String!) {
          item(where: {class_id: {_eq: "Country"}, nameEn: {_eq: $countryName}}) {
            nameEn
            currency: statements(where: {property_id: {_eq: "currency"}}) {
              object {
                nameEn
              }
            }
          }
        }
      `,
      variables: { countryName },
    }),
  });

  const data = await response.json();
  return data.data.item[0]?.currency[0]?.object.nameEn || "Not Found";
};

export default function Curfinder() {
  const [countryName, setCountryName] = useState("");
  const [currency, setCurrency] = useState("");

  const handleSearch = async () => {
    const result = await fetchCurrency(countryName);
    setCurrency(result);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "rgb(247, 205, 21)",
        padding: "0px",
        margin: "0px",
      }}
    >
      <img
        src="/image/currencies.png"
        alt="Background Image"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.8,
        }}
      />

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "50%",
          left: "62%",
          transform: "translate(-50%, -50%)",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Enter Country Name"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          className="inputCountry"
        />
        <Button onClick={handleSearch} className="btnSearch">
          Search
          <Icon as={Search2Icon} boxSize={6} />
        </Button>
        <span className="resultText">
          {currency && <Text>{`Currency: ${currency}`}</Text>}
        </span>
      </div>
    </div>
  );
}
