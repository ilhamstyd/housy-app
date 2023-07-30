import search_1 from "../assets/search_1.png";
import { API } from "../config/api";
import { useQuery, useMutation } from "react-query";

export const ListTransaction = () => {
  let { data: transactions } = useQuery("ownertransactionCache", async () => {
    const response = await API.get("/transactions");
    console.log("ini list transaction :", response.data.data);
    return response.data.data;
  });
  return (
    <div>
      <h2 className="mt-3">List Transaction</h2>
      <table className="table mt-5">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Users</th>
            <th scope="col">Type Of Rent</th>
            <th scope="col">Status Paymet</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        {transactions?.map((data, index) => (
          <tbody key={index}>
            <tr>
              <th scope="row"></th>
              <td>{data?.user.fullname}</td>
              <td>{data?.house.type_rent}</td>
              {data?.status === "success" ? (
              <td className="text-success fw-semibold">{data?.status}</td>
              ):(
                <td className="text-danger fw-semibold">{data?.status}</td>
              )}
              <td>
                <img src={search_1} alt="" />
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};
