install:
	go build -o $(HOME)/go/bin/kwenta-prover ./main.go

config:
	# create log files
	sudo mkdir -p /var/log/kwenta-fee-reimbursement-prover
	sudo touch /var/log/kwenta-fee-reimbursement-prover
	# copying over systemd config files
	sudo cp configs/*.service /etc/systemd/system
	sudo systemctl daemon-reload
	sudo systemctl enable kwenta-fee-reimbursement-prover

start-fee-reimbursement: config install
	sudo systemctl restart kwenta-fee-reimbursement-prover