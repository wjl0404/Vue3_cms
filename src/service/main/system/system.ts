import myRequest from '../../index'

export function getPageList(pageUrl: string, queryInfo: any) {
  return myRequest.post({
    url: pageUrl,
    data: queryInfo
  })
}

export function deletePageData(pageUrl: string) {
  return myRequest.delete({
    url: pageUrl
  })
}

export function newPageData(pageUrl: string, newData: any) {
  return myRequest.post({
    url: pageUrl,
    data: newData
  })
}

export function editPageData(pageUrl: string, editData: any) {
  return myRequest.patch({
    url: pageUrl,
    data: editData
  })
}
