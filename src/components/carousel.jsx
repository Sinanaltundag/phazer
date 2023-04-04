import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../assets/css/carousel.css";

const CarouselEx = () => {
  const [selected, setSelected] = useState(0);
  const [selected2, setSelected2] = useState(0);
  const [selected3, setSelected3] = useState(0);


  return (
    <div>
      <h1>Carousel</h1>
      <div
        style={{
          width: "500px",
          margin: "50px auto",
        }}
      >
        <Carousel showArrows={true} width={700} selectedItem={selected} showThumbs={false} >
          <Carousel
            showArrows={false}
            selectedItem={selected2}
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            width={700}
            axis="vertical"
          >
            <Carousel
              showArrows={false}
              selectedItem={selected3}
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              width={700}
              axis="horizontal"
            >

            <div
            onClick={() => {
              setSelected2(1);
              }
            }
            >
              <img src="https://picsum.photos/700/501/?random" />
            </div>
            <div
            onClick={() => {
              setSelected2(0);
              }
            }
            >
              <img src="https://picsum.photos/700/500/?random" />
            </div>
            </Carousel>
            <Carousel
              showArrows={false}
              selectedItem={selected3}
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              width={700}
              axis="horizontal"
            >
            <div
            onClick={() => {
              setSelected(1);
              }
            }
            >
              <img src="https://picsum.photos/700/502/?random" />
            </div>
            </Carousel>
          </Carousel>
          <div
            className="container"
            // style={{
            //     display: "grid",
            //     gridTemplateColumns: "repeat(3, 1fr)",
            //     gridTemplateRows: "repeat(2, 1fr)",
            //     gridColumnGap: "0px",
            //     gridRowGap: "0px",
            //     borderRadius: "50px",
            // }}
          >
            <button
                className="select-btn"
              onClick={() => {
                setSelected(0);
                }}
            >
              go to slide 1
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(1);
                }}
            >
              go to slide 2
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(2);
                }}
            >
              go to slide 3
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(3);
                }}
            >
              go to slide 4
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(4);
                }}
            >
              go to slide 5
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(5);
                }}
            >
              go to slide 6
            </button>
            <p className="legend">Legend 2</p>
          </div>
          <div
            className="container"
            // style={{
            //     display: "grid",
            //     gridTemplateColumns: "repeat(3, 1fr)",
            //     gridTemplateRows: "repeat(2, 1fr)",
            //     gridColumnGap: "0px",
            //     gridRowGap: "0px",
            //     borderRadius: "50px",
            // }}
          >
            <button
                className="select-btn"
              onClick={() => {
                setSelected(0);
                }}
            >
              go to slide 1
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(1);
                }}
            >
              go to slide 2
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(2);
                }}
            >
              go to slide 3
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(3);
                }}
            >
              go to slide 4
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(4);
                }}
            >
              go to slide 5
            </button>
            <button
                className="select-btn"
              onClick={() => {
                setSelected(5);
                }}
            >
              go to slide 6
            </button>
            <p className="legend">Legend 3</p>
          </div>
            

        </Carousel>
      </div>
    </div>
  );
};

export default CarouselEx;
