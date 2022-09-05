import React from 'react';


const Cover = ({ connect }) => {
    return (
      <div className="cover_page d-flex align-items-center">
        <div className="cover_header d-flex align-items-center">
          <div className="cover_text">
            <h1>New Luxury vintage wine made into extraordinary NFTs</h1>
            <p>
              We offer a great variety of vintage wines made into NFT for 
              every price point and any occassion
            </p>
            <button
              onClick={() => connect().catch((e) => console.log(e))}
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    );
};

export default Cover;
