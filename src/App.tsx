import React, { useEffect, useMemo } from "react";
import styled from "styled-components/macro";

import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import "./App.css";
import { Button, ChakraProvider, Icon } from "@chakra-ui/react";
import axios from "axios";

function App() {
  const [color, setColor] = useColor("hex", "#121212");
  const [currentColor, setCurrentColor] = React.useState<any>();
  const axiosConfig = useMemo(
    () => ({
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_LIFX_TOKEN,
      },
    }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://api.lifx.com/v1/lights/d073d5688321",
        axiosConfig
      );
      console.log(response.data);
      setCurrentColor({
        h: response.data[0].color.hue,
        s: response.data[0].color.saturation * 1000,
        v: response.data[0].brightness * 100,
      });
    };
    fetchData();
  }, [axiosConfig]);

  return (
    <Container className="App">
      <ChakraProvider>
        Current Light Color
        <CurrentColor
          h={currentColor?.h}
          s={currentColor?.s}
          v={currentColor?.v}
        />
        <Border>
          <ColorPicker
            width={456}
            height={228}
            color={color}
            onChange={(e) => {
              console.log(e);
              setColor(e);
            }}
            dark
          />
        </Border>
        <br />
        <Button
          colorScheme="whatsapp"
          size={"lg"}
          _focus={{ border: "none" }}
          onClick={async () => {
            console.log(color);
            await axios.put(
              `https://api.lifx.com/v1/lights/d073d5688321/state`,
              { power: "on", color: color.hex },
              axiosConfig
            );
            console.log(color.hsv);
            setCurrentColor(color.hsv);
          }}
        >
          Set 💡
        </Button>
      </ChakraProvider>
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const Border = styled.div`
  padding: 5px;
  background-color: black;
  border-radius: 15px;
`;

const CurrentColor = styled.div<{ h: number; s: number; v: number }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${({ h, s, v }) =>
    "hsl(" + h + "," + s + "%," + v / 2 + "%)"};
  margin: 10px 0 25px 0;
`;
