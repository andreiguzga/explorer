import Timestamp from 'react-timestamp'
import FlagLocation from '../Common/FlagLocation'
import { formatHotspotName } from '../Hotspots/utils'
import { round } from 'lodash'
import { useCallback } from 'react'
import AccountAddress from '../AccountAddress'
import HotspotSimpleIcon from '../Icons/HotspotSimple'
import LocationIcon from '../Icons/Location'
import Flag from '../Common/Flag'
import BaseSearchResult from './BaseSearchResult'

const SearchResult = ({ result, onSelect, selected = false }) => {
  const handleSelect = useCallback(() => {
    onSelect(result)
  }, [onSelect, result])

  if (result.type === 'hotspot' || result.type === 'dataonly') {
    return (
      <BaseSearchResult
        title={formatHotspotName(result.item.name)}
        subtitle={<FlagLocation geocode={result.item.geocode} />}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'validator') {
    return (
      <BaseSearchResult
        title={formatHotspotName(result.item.name)}
        // subtitle={<ValidatorFlagLocation geo={result.item.geo} />}
        subtitle={
          <div className="flex items-center space-x-1">
            <img src="/images/penalty.svg" className="w-3" alt="" />{' '}
            <span>{round(result.item.penalty, 2)}</span>
          </div>
        }
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'account') {
    return (
      <BaseSearchResult
        title={<AccountAddress address={result.item.address} truncate />}
        subtitle={[
          result.item.balance.toString(2),
          result.item.secBalance.toString(2),
          result.item.dcBalance.toString(),
        ].join(' ')}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'block') {
    return (
      <BaseSearchResult
        title={`#${result.item.height.toLocaleString()}`}
        subtitle={
          <span className="flex space-x-2">
            <Timestamp date={result.item.time} />
            <span>{result.item.transactionCount.toLocaleString()} tx</span>
          </span>
        }
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'transaction') {
    return (
      <BaseSearchResult
        title={truncateHash(result.item.hash)}
        subtitle={<Timestamp date={result.item.time} />}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'city') {
    return (
      <BaseSearchResult
        title={[
          result.item.longCity,
          result.item.shortState,
          result.item.shortCountry,
        ].join(', ')}
        subtitle={`${result.item.hotspotCount.toLocaleString()} Hotspots`}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'hex') {
    const [streetAddress] = result.item.placeName.split(',', 1)

    const addressRemainder = [
      result.item.placeName.substr(streetAddress.length + 1),
    ]

    return (
      <BaseSearchResult
        title={
          <div className="flex flex-col items-start justify-start">
            <span className="">{streetAddress}</span>
            <div className="flex items-start justify-start">
              <Flag
                countryCode={result.item.countryCode}
                className="mr-1.5 w-3 h-auto"
              />
              <span className="text-xs text-gray-600">{addressRemainder}</span>
            </div>
          </div>
        }
        subtitle={`${result.item.hotspotCount.toLocaleString()} Hotspots`}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'maker') {
    return (
      <BaseSearchResult
        title={result.item.name}
        subtitle={
          <div className="flex space-x-2">
            <div className="flex items-center space-x-1">
              <HotspotSimpleIcon className="text-green-500 w-3 h-auto" />
              <span>{result.item.txns.addGatewayTxns.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LocationIcon className="text-pink-500 w-3 h-auto" />
              <span>
                {result.item.txns.assertLocationTxns.toLocaleString()}
              </span>
            </div>
          </div>
        }
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }
  return null
}

const truncateHash = (hash) => [hash.slice(0, 10), hash.slice(-10)].join('...')

export default SearchResult
