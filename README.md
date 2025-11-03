


      {restorentId ? (
                  <>
                    <div className="w-full border bg-amber-200 p-4">
                      <h2 className="item-center ">Restorent Item List</h2>
                    </div>
                    <div
                      key={item.id}
                      className="bg-blue-200 shadow p-4 rounded-xl cursor-pointer"
                      onClick={() => setRestorentId(item?.id)}
                    >
                      <h3 className="text-lg font-semibold">
                        Restorent Name : {item?.name}
                      </h3>
                      <h3 className="text-lg font-semibold">
                        Restorent Address : {item?.address}
                      </h3>

                      <button
                        onClick={() => {
                          addToCart(item);
                          showToast({
                            type: "success",
                            message: "Item add the card successfully",
                          });
                        }}
                        className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </>