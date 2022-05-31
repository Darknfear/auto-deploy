## Môi trường yêu cầu

| Tên | Phiên bản |
|---|---|
| [Node.js](https://nodejs.org/ja/download/) | 14.x trở lên |
| [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) | 2.0 trở lên |

## Tạo profile bằng AWS CLI

* Ở đây, tên hồ sơ là `deployer-stg` cho môi trường staging và `deployer-production` cho môi trường production.

```bash
$ aws configure --profile deployer-production
AWS Access Key ID: XXXXXXXXXX
AWS Secret Access Key: XXXXXXXXXX
Default region name: ap-northeast-1
Default output format:
```

## Installation

```bash
$ npm install
```

## Running

```bash
$ npm start
```

## Nó hoạt động như nào?

File `setting-example.json` là file chứa mẫu config cho các stack đồng thời các giá trị ghi sẵn trong file cũng là các giá trị mặc định cho các Parameters của mỗi stack.

Khi excute code, các giá trị của stack sẽ được lưu lại vào file `setting.json` và các giá trị này sẽ được đọc thành giá trị mặc định cho lần excute sau.

Các key ở cấp độ ngoài cùng tương ứng với mỗi stack, tuy nhiên có 2 key khác là `AwsProfile` và `EnvironmentName`. Ý nghĩa của chúng là:
- `AwsProfile`: Là tên của profile setting trong AWS CLI profile ở máy của bạn. Trường này nếu không có giá trị thì profile sẽ là `EnvironmentName`.
- `EnvironmentName`: Là tên môi trường của bạn. Nó sẽ là prefix cho tên của các stack và một số tên khác trong các service AWS.

Mỗi option của `Pick one stack!` tượng trưng cho mỗi stack của cloudformation, trong mỗi stack sẽ có `Deploy` và `Delete stack`. Trong mỗi lựa chọn `Deploy` sẽ hỏi bạn có làm theo trình hướng dẫn hay không.

Chọn `Deploy` ngay tại `Pick one stack!` để deploy lần lượt tất cả các stack theo đúng thứ tự chuẩn.

Riêng trong S3 có 2 option là `Put ecs-service.yaml` và `Put custom-batch.sh`:
- `Put ecs-service.yaml` giúp đẩy file `ecs-service.yaml` trong `templates` directory lên S3 để CI/CD runner viết sẵn trong `ec2.yaml` có thể download về và deploy ecs.
- `Put custom-batch.sh` giúp đẩy file `custom-batch.sh` trong `templates` directory lên S3 để khi deploy `ec2.yaml` sẽ tự động download về và run các batch script không được setup sẵn theo nhu cầu của bạn.


## Lưu ý

- Nếu bạn chọn `Yes` cho câu hỏi `Do you want to skip the guided?` thì hãy đảm bảo rằng file `setting.json` đã điền đủ các giá trị. Ngược lại thì bạn sẽ phải làm theo trình hướng dẫn.

- Nếu bạn chọn xóa stack thì hãy đảm bảo rằng stack ấy không import giá trị output từ stack khác.

- Nếu bạn hiểu về cloudformation và cần chỉnh sửa các stack thì có thể sửa file `.yaml` trong `templates` directory

- Nếu bạn sửa file `custom-batch.sh` và upload lại lên S3 sau khi đã deploy stack `ec2` thì bạn phải xóa stack ec2 đi và deploy lại stack này sau khi upload thành công file `custom-batch.sh`. Vì vậy hãy đảm bảo nếu cần thêm gì đó ở trong file này hãy chắc chắn nó stack `ec2` chưa được deploy.