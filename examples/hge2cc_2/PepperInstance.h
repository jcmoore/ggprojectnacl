#pragma once

#include <pthread.h>
#include <map>
#include <vector>

#include <ppapi/cpp/instance.h>
#include <ppapi/cpp/completion_callback.h>
#include <ppapi/utility/completion_callback_factory.h>

class PepperInstance : public pp::Instance
{
public:
	explicit PepperInstance(PP_Instance instance);
	virtual ~PepperInstance();
	
	virtual bool Init(uint32_t argc, const char* argn[], const char* argv[]);
	virtual void DidChangeView(const pp::View& view);
	virtual void HandleMessage(const pp::Var& message);
};
