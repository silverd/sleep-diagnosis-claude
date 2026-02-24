export function List({ title, data }) {
  return (
    <div className="rounded-md bg-white p-4">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          {title}
        </h3>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {data.map((row, index) => {
            return (
              <div
                key={index}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  {row.key}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {row.value +
                    (row.evaluation ? `; ${row.evaluation}` : '') +
                    (row.rating ? `; ${row.rating}` : '')}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </div>
  )
}
