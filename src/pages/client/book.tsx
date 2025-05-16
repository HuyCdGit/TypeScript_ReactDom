import { fetchBookById } from "@/services/api";
import BookDetail from "./book/detail.book";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const BookPage = () => {
  const { id } = useParams();
  const [viewBook, setViewBook] = useState<IBookTable | null>(null);
  const fetchBook = async (_id: string) => {
    const res = await fetchBookById(_id);
    if (res && res.data) {
      setViewBook(res.data);
    }
  };
  useEffect(() => {
    if (id) {
      //do something
      fetchBook(id);
    }
  }, [id]);
  return <BookDetail viewBook={viewBook} setViewBook={setViewBook} />;
};
export default BookPage;
