import { LOCAL_DOMAIN } from "@/utils/constants";
import { Currency } from "@/utils/type";
import { getCurrency } from "@/utils/currency";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Info from "./info";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function CurrencyDialog({ isOpen, setIsOpen }: Props) {
  const { register, handleSubmit, getValues } = useForm();
  const [currency, setCurrency] = useState<Currency>();
  const [isSearching, setIsSearching] = useState(false);

  async function onSubmit(data: FieldValues) {
    const { currencyId } = data;

    if (isSearching == false) {
      getCurrencyInfo(currencyId);
    } else {
      await axios.post(`${LOCAL_DOMAIN}/currency`, currency);
      setIsOpen(false);
    }
  }

  async function getCurrencyInfo(currencyId: string) {
    const result = await getCurrency(currencyId);
    setCurrency(result);
    setIsSearching(true);
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
                  add currency
                </Dialog.Title>
                <form className="text-black" onSubmit={handleSubmit(onSubmit)}>
                  <label className="block mt-4">
                    <span className="text-gray-700 uppercase tracking-widest font-bold">
                      id
                    </span>
                    <div className="flex flex-row gap-x-5">
                      <input
                        type="number"
                        {...register("currencyId")}
                        className="px-2 py-1 mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                      />
                    </div>
                  </label>
                  {currency && (
                    <div className="mt-5">
                      <p className="text-center capitalize font-bold text-[20px]">
                        search result
                      </p>
                      <Info {...currency} />
                    </div>
                  )}

                  <div className="flex justify-center gap-x-4">
                    <button
                      type="submit"
                      className="text-black capitalize bg-white px-4 py-2 mt-4 block rounded-lg shadow-lg active:shadow-inner"
                    >
                      {isSearching ? "submit" : "search"}
                    </button>
                    {isSearching && (
                      <button
                        type="button"
                        onClick={() => {
                          getCurrencyInfo(getValues("currencyId"));
                        }}
                        className="text-black capitalize bg-white px-4 py-2 mt-4 block rounded-lg shadow-lg active:shadow-inner"
                      >
                        search
                      </button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
