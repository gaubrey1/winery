import PropTypes from "prop-types";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Col, Modal, Form } from "react-bootstrap";
import { useState } from "react";

// NFT Cards Functionality
const Nft = ({ nft, buyNft, data }) => {
  const { image, description, owner, name, wineId, price, sold } = nft;
  const { kit } = useContractKit();
  const { defaultAccount } = kit;
  
  const [show, setShow] = useState(false);
  const [receiverAdd, setAddress] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const isFormFilled = () => price;

  // Button function to display a particular button depending on the owner and the availability of the powerup
  const buttonFunc = () => {
    let btnText;
    if(owner !== defaultAccount) {
      sold ? btnText = <button className="sold_nft">Sold</button> : btnText = <button className="buy_nft" onClick={buyNft}>Buy<span> {price / 10 ** 18}cUSD</span></button>
    }
    else {
      btnText = <button className="owned_nft" onClick={handleShow}>Gift</button>
    }
    return <>{btnText}</>
  }

  return (
    <>
    <Col key={wineId} className="mb-5">
      <div className="wine_container d-flex flex-wrap">
        <div className="wine_image">
          <img src={image} alt={name}/>
        </div>
        
        { sold ? (
          <span className="sold_tag">Sold</span>
        ) : ("")}

        <div className="wine_details">
          <h2 className="wine_name d-flex justify-content-around">
            {name}
          </h2>
          <p className="wine_desc">{description}</p>
        </div>

        <div className="wine_btn d-flex gap-4 align-items-center justify-content-center">
          {buttonFunc()}
        </div>
      </div>
    </Col>


     {/* Modal For Gifting an NFT*/}
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title
          style={{ color: "#531c1c", width: "100%", textAlign: "center" }}
        >Recipient's Wallet Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            type="text"
            placeholder="Wallet Address"
            className={"mb-3"}
            style={{ height: "45px", fontSize: "0.9rem" }}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </Form>
      </Modal.Body>
      
      <Modal.Footer  className="modal_footer">
        <button className="close_btn" onClick={handleClose}>
          Close
        </button>
        <button
          className="create_btn"
          disabled={!isFormFilled()}
          onClick={() => {
            data({
              receiverAdd,
              wineId
            });
            handleClose();
          }}
          >
          Send
        </button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

Nft.propTypes = {
  // props passed into this component
  image: PropTypes.instanceOf(Object).isRequired,
};

export default Nft;
