http://localhost:3000/spso/printerList -> lấy danh sách máy in

http://localhost:3000/spso/printer/printer1 -> thông tin máy in 1( tương tự cho các máy khác) 

http://localhost:3000/spso/roomlist -> lấy danh sách phòng chứa máy in

http://localhost:3000/spso/historyLog -> lấy lịch sử

http://localhost:3000/spso/config -> lấy cấu hình

Đã thêm các phương thức update,delete.

Các phương thức update(pageSizes,pageUnitPrice,defaultConfig khi dùng postman thì cần có id của config để tiến hành update ví dụ

{

    "configId": "config1",
    
    "pageSizes": ["A4", "A3"]
    
}

 Khi addPrinter thì cần đầy đủ các thông số 
 
                printerId,
                
                roomId,
                
                detail,
                
                config,
                
                jobQueue = [],
                
                historyDocRepo = []

Khi xóa máy in thì /removePrinter/:printerId ví dụ /removePrinter/printer2
 
