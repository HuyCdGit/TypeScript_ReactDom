import { Row, Col, Rate, Divider, Button, App as AppAntd } from "antd";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import "styles/book.scss";
import ModalGallery from "./modalGaller.book";
import BookLoader from "./loader.book";
import { useCurrentApp } from "@/components/context/app.context";
interface IProps {
  viewBook: IBookTable | null;
  setViewBook: (v: IBookTable | null) => void;
}
type UserAction = "MINUS" | "PLUS";

const BookDetail = (props: IProps) => {
  const { viewBook } = props;
  const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const { user, setCarts } = useCurrentApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageGallery, setImageGallery] = useState<
    {
      original: string;
      thumbnail: string;
      originalClass: string;
      thumbnailClass: string;
    }[]
  >([]);
  const refGallery = useRef<ImageGallery>(null);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const { notification } = AppAntd.useApp();
  useEffect(() => {
    setIsLoader(true);
    if (viewBook) {
      const images = [];
      if (viewBook?.thumbnail) {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            viewBook?.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            viewBook?.thumbnail
          }`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      }
      if (viewBook.slider) {
        viewBook.slider.map((items) =>
          images.push({
            original: `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${items}`,
            thumbnail: `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${items}`,
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image",
          })
        );
      }
      setImageGallery(images);
      setIsLoader(false);
    }
  }, [viewBook]);

  const handleOnClickImage = () => {
    //get current index onClick
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  const handleChangeButton = (type: UserAction) => {
    if (type === "MINUS") {
      if (currentQuantity - 1 <= 0) return;
      setCurrentQuantity(currentQuantity - 1);
    }
    if (type === "PLUS") {
      if (currentQuantity && viewBook) {
        if (currentQuantity === +viewBook.quantity) return;
        setCurrentQuantity(currentQuantity + 1);
      }
    }
  };
  const handleChangInput = (value: string) => {
    if (!isNaN(+value)) {
      if (+value > 0 && viewBook && +value < viewBook.quantity) {
        setCurrentQuantity(+value);
      }
    }
  };
  const handleCart = () => {
    const cartStorage = localStorage.getItem("carts");
    if (user && viewBook) {
      const items = [];
      if (!cartStorage) {
        //create
        items.push({
          id: viewBook._id,
          quantity: viewBook?.quantity,
          detail: viewBook,
        });
        localStorage.setItem("carts", JSON.stringify(items));
        setCarts(items);
        notification.success({
          message: "Create Successed",
          description: `tạo localStorage thành công`,
        });
      } else {
        //update
        const carts = JSON.parse(cartStorage) as ICart[];
        const isExistIndex = carts.findIndex((c) => c.id === viewBook._id);
        if (isExistIndex > -1) {
          carts[isExistIndex].quantity = viewBook.quantity + currentQuantity;
        } else {
          carts.push({
            id: viewBook._id,
            quantity: viewBook?.quantity,
            detail: viewBook,
          });

          notification.success({
            message: "Update Successed",
            description: `lưu localStorage thành công`,
          });
        }
        setCarts(carts);
        localStorage.setItem("carts", JSON.stringify(carts));
      }
    }
  };
  return (
    <div>
      {isLoader ? (
        <BookLoader />
      ) : (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
          <div
            className="view-detail-book"
            style={{
              maxWidth: 1440,
              margin: "0 auto",
              minHeight: "calc(100vh - 150px)",
            }}
          >
            <div
              style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
            >
              <Row gutter={[20, 20]}>
                <Col md={10} sm={0} xs={0}>
                  <ImageGallery
                    ref={refGallery}
                    items={imageGallery}
                    showPlayButton={false} //hide play button
                    showFullscreenButton={false} //hide fullscreen button
                    renderLeftNav={() => <></>} //left arrow === <> </>
                    renderRightNav={() => <></>} //right arrow === <> </>
                    slideOnThumbnailOver={true} //onHover => auto scroll images
                    onClick={() => handleOnClickImage()}
                  />
                </Col>
                <Col md={14} sm={24}>
                  <Col md={0} sm={24} xs={24}>
                    <ImageGallery
                      ref={refGallery}
                      items={imageGallery}
                      showPlayButton={false} //hide play button
                      showFullscreenButton={false} //hide fullscreen button
                      renderLeftNav={() => <></>} //left arrow === <> </>
                      renderRightNav={() => <></>} //right arrow === <> </>
                      showThumbnails={false}
                    />
                  </Col>
                  <Col span={24}>
                    <div className="author">
                      Tác giả: <a href="#">{viewBook?.author}</a>{" "}
                    </div>
                    <div className="title">{viewBook?.mainText}</div>
                    <div className="rating">
                      <Rate
                        value={5}
                        disabled
                        style={{ color: "#ffce3d", fontSize: 12 }}
                      />
                      <span className="sold">
                        <Divider type="vertical" />
                        {viewBook?.sold}
                      </span>
                    </div>
                    <div className="price">
                      <span className="currency">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(viewBook?.price ?? 0)}
                      </span>
                    </div>
                    <div className="delivery">
                      <div>
                        <span className="left">Vận chuyển</span>
                        <span className="right">Miễn phí vận chuyển</span>
                      </div>
                    </div>
                    <div className="quantity">
                      <span className="left">{viewBook?.quantity}</span>
                      <span className="right">
                        <Button
                          onClick={() => {
                            handleChangeButton("MINUS");
                          }}
                        >
                          <MinusOutlined />
                        </Button>

                        <input
                          onChange={(e) => {
                            handleChangInput(e.target.value);
                          }}
                          value={currentQuantity}
                        />
                        <Button
                          onClick={() => {
                            handleChangeButton("PLUS");
                          }}
                        >
                          <PlusOutlined />
                        </Button>
                      </span>
                    </div>
                    <div className="buy">
                      <button
                        className="cart"
                        onClick={() => {
                          handleCart();
                        }}
                      >
                        <BsCartPlus className="icon-cart" />
                        <span>Thêm vào giỏ hàng</span>
                      </button>
                      <button className="now">Mua ngay</button>
                    </div>
                  </Col>
                </Col>
              </Row>
            </div>
          </div>

          <ModalGallery
            isOpenModalGallery={isOpenModalGallery}
            setIsOpenModalGallery={setIsOpenModalGallery}
            currentIndex={currentIndex}
            items={imageGallery}
            title={"hardcode"}
          />
        </div>
      )}
    </div>
  );
};
export default BookDetail;
