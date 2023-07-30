import search_1 from "../assets/search_1.png";

export const ListTransaction = () => {
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
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Furnished</td>
            <td className="text-danger fw-semibold">Pending</td>
            <td><img src={search_1} alt="" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
