import React, { useState, useTransition } from 'react'
import { Label, TextInput, useTheme } from '@primer/react'
import { DataTable, Table } from '@primer/react/drafts'
import { SearchIcon } from '@primer/octicons-react'
import { useDebounce, useThrottleFn } from 'react-use'

interface Artist {
  id: string
  name: string
  type: string
  gender: string
  area?: {
    name: string
  }
  disambiguation?: string
}

function SearchPage() {
  const [, startTransition] = useTransition()
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState<Artist[]>([])
  const [total, setTotal] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { theme } = useTheme()

  async function handleSearch(pageIndex = 0) {
    try {
      const result = await window.queryMusicBrainz(searchText, pageIndex)
      if (result.error) {
        console.error(result)
        return
      }
      startTransition(() => {
        setData(result.artists)
        setTotal(result.count)
      })
    }
    catch (e) {
      // Result is out of date
      // So dump
    }
  }

  useDebounce(async () => {
    if (searchText) {
      setIsLoading(true)
      await handleSearch()
      setIsLoading(false)
    }
  }, 500, [searchText])

  useThrottleFn(async (pageIndex) => {
    await handleSearch(pageIndex)
  }, 500, [pageIndex])

  return (
    <div className="search-page">
      <Table.Container>
        <Table.Title as="h2" id="musicbrainz">
          MusicBrainz
        </Table.Title>
        <Table.Subtitle as="p" id="musicbrainz-claims">
          MusicBrainz is an open music encyclopedia that collects music metadata and makes it available to the public.
        </Table.Subtitle>
        <TextInput placeholder="Artist name" leadingVisual={<SearchIcon />} loaderPosition="leading" loading={isLoading} size="medium" sx={{ gridArea: 'filter', margin: '8px 0' }} value={searchText} onChange={e => setSearchText(e.currentTarget.value)} />
        <DataTable
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={data}
          columns={[
            {
              header: 'Name',
              field: 'name',
              renderCell(row) {
                return (
                  <span style={{ lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.name}
                    {
                  row.disambiguation
                    ? (
                      <span style={{ color: theme?.colors.fg.subtle }}>
                        {' '}
                        (
                        {row.disambiguation}
                        )
                      </span>
                      )
                    : null
                }
                  </span>
                )
              },
              maxWidth: 300,
            },
            {
              header: 'Type',
              field: 'type',
              renderCell(row) {
                return row.type ? <Label sx={{ margin: '-4px 0' }}>{ row.type }</Label> : null
              },
            },
            {
              header: 'Gender',
              field: 'gender',
              renderCell(row) {
                return row.gender ? <Label sx={{ margin: '-4px 0' }}>{ row.gender }</Label> : null
              },
            },
            {
              header: 'Area',
              field: 'area.name',
              renderCell(row) {
                return row.area && row.area.name
                  ? (
                    <span>
                      {row.area.name}
                    </span>
                    )
                  : null
              },
            },
          ]}
        >
        </DataTable>
        {
        data.length === 0
          ? (
            <Table.Skeleton columns={[
              {
                header: 'Name',
              },
              {
                header: 'Type',
              },
              {
                header: 'Gender',
              },
              {
                header: 'Area',
              },
            ]}
            />
            )
          : null
      }
        <Table.Pagination
          aria-label="search-page-pagination"
          totalCount={total}
          pageSize={10}
          onChange={({ pageIndex }) => setPageIndex(pageIndex)}
          showPages={false}
        />
      </Table.Container>
    </div>
  )
}

export default SearchPage
