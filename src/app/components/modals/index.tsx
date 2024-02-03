import { Fragment } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import Image from "next/image";
import axios from "axios";
import { LOCAL_DOMAIN } from "@/utils/constants";
import { Currency, AssetDTO } from "@/utils/type";
import { getLogo, getSymbol } from "@/utils/assets";
import { GoPlus } from "react-icons/go";
import { useSIWE } from "connectkit";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsCurrencyOpen: (isOpen: boolean) => void;
  currency: Currency[];
  mutate: () => Promise<any>;
}

export default function AssetDialog({
  isOpen,
  setIsOpen,
  setIsCurrencyOpen,
  currency,
  mutate,
}: Props) {
  const { register, handleSubmit, control } = useForm();
  const { data: session } = useSIWE();

  async function onSubmit(data: FieldValues) {
    const { currencyId, value, quantity } = data;

    const reqBody: AssetDTO = {
      currencyId: Number(currencyId),
      quantity: Number(quantity),
      value: Number(value),
      creator: session.address,
    };

    try {
      await axios.post(`${LOCAL_DOMAIN}/assets`, reqBody);
      mutate(); // UI refetch
      setIsOpen(false);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="uppercase text-lg font-medium leading-6 text-gray-900"
                >
                  add item
                </Dialog.Title>
                <form className="text-black" onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-4">
                    <Controller
                      control={control}
                      name="currencyId"
                      defaultValue={currency[0].id}
                      render={({ field }) => (
                        <Listbox
                          onChange={field.onChange}
                          value={field.value}
                          name={field.name}
                        >
                          <section className="flex flex-row items-center ">
                            <Listbox.Label className="mr-4 pb-2">
                              <p className="leading-5 ">Currency</p>
                            </Listbox.Label>

                            <div className="relative inline-block min-w-[120px]">
                              <Listbox.Button className="rounded-lg bg-white pl-4 w-full">
                                <div className="flex relative gap-x-2">
                                  <Image
                                    width={20}
                                    height={20}
                                    style={{ width: "auto", height: 20 }}
                                    src={`${getLogo(currency, field.value)}`}
                                    alt="logo"
                                  />
                                  <p>{getSymbol(currency, field.value)}</p>
                                </div>
                              </Listbox.Button>

                              <Listbox.Options className="overflow-auto mt-0.5  absolute bg-white rounded-lg w-full max-h-[150px] cursor-pointer drop-shadow-sm">
                                {currency.map((item: Currency, index) => (
                                  <Listbox.Option
                                    key={index}
                                    value={item.id}
                                    className="pl-4 py-2 hover:bg-slate-100 duration-300 drop-shadow-lg rounded-lg"
                                  >
                                    <div className="flex relative gap-x-2">
                                      <Image
                                        width={20}
                                        height={20}
                                        style={{ width: "auto", height: 20 }}
                                        src={`${item.logo}`}
                                        alt="logo"
                                      />
                                      <p>{item.symbol}</p>
                                    </div>
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                setIsCurrencyOpen(true);
                              }}
                            >
                              <GoPlus />
                            </button>
                          </section>
                        </Listbox>
                      )}
                    />
                  </div>

                  <label className="block mt-4">
                    <span className="text-gray-700 capitalize">cost</span>
                    <input
                      type="number"
                      {...register("value")}
                      className="px-2 py-1 mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    />
                  </label>

                  <label className="block mt-4">
                    <span className="text-gray-700 capitalize">quantity</span>
                    <input
                      type="number"
                      {...register("quantity")}
                      className="px-2 py-1 mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    />
                  </label>

                  <button
                    type="submit"
                    className="text-black bg-white px-4 py-2 mt-4 block mx-auto rounded-lg shadow-lg active:shadow-inner"
                  >
                    Submit
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
